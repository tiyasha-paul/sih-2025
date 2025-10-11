import json
import os
import sys
from flask import Flask, request, jsonify
import re

# Add parent directory to path to import from CHAT folder
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Load metadata from data.json
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'CHAT', 'data.json')

metadata_json = {}
try:
    with open(DATA_PATH, "r") as f:
        data_json = json.load(f)

    for state, records in data_json.items():
        for r in records:
            r['state'] = state.strip().upper()
            r['location'] = r['location'].strip().upper()
            try:
                extraction = r.get('ground_water_extraction_ham')
                extractable = r.get('annual_extractable_ground_water_resources_ham')
                if extraction is None or extractable is None or extractable == 0:
                    r['sgwd'] = None
                    r['approx_category'] = 'N/A'
                else:
                    r['sgwd'] = (float(extraction) / float(extractable)) * 100
                    r['approx_category'] = ('Safe' if r['sgwd'] <= 70 else
                                           'Semi-Critical' if r['sgwd'] <= 90 else
                                           'Critical' if r['sgwd'] < 100 else
                                           'Over-Exploited')
            except (TypeError, ValueError):
                r['sgwd'] = None
                r['approx_category'] = 'N/A'
            key = f"{r['location']}_{r['state']}_{r['year'].strip()}"
            metadata_json[key] = r
except Exception as e:
    print(f"Error loading data.json: {e}")

def normalize(s):
    if not s:
        return ""
    return re.sub(r"\s+", " ", s.strip().upper())

def extract_location_and_year(query):
    match = re.search(r"\b(\d{4}(?:-\d{2,4})?)\b", query)
    year = match.group(1) if match else None

    query_clean = query if not year else query.replace(year, "").strip()

    viz_keywords = r"(?:plot|graph|chart|visuali[sz]e|visualization|trend|show|display|generate|bar)"
    has_viz_keyword = bool(re.search(viz_keywords, query_clean.lower()))

    query_type = None
    if has_viz_keyword:
        if 'category' in query_clean.lower() or 'bar' in query_clean.lower():
            query_type = "category_bar"
        else:
            query_type = "trend"

    keywords_to_remove = r"(groundwater|gw|rainfall|rain|details|level|information|full|category|of|for|in|the|at|on|plot|graph|show|display|generate|visuali[sz]e|visualization|chart|trend|bar|extraction|from|to|about|\?|and)"
    query_clean = re.sub(keywords_to_remove + r"(?=\s+|$)", "", query_clean, flags=re.I).strip()
    query_clean = re.sub(r"\s+", " ", query_clean)

    parts = [p for p in query_clean.split() if p and not p.lower() in {"the", "at", "on", "of"}]
    location = " ".join(parts) if parts else None

    state = None
    if location:
        location_norm = normalize(location)
        for record in metadata_json.values():
            if normalize(record['state']) == location_norm or normalize(record['state']).startswith(location_norm):
                state = record['state']
                break

        if not state:
            for record in metadata_json.values():
                record_loc = normalize(record['location'])
                if record_loc == location_norm or record_loc.startswith(location_norm) or location_norm in record_loc:
                    state = record['state']
                    break

    return location, state, year, query_type

def generate_visualization_response(query_type, state, location, year):
    """Generate static response for visualization requests"""
    state = state or 'Delhi'
    year = year or '2024'

    if query_type == "category_bar":
        return {
            'query_type': 'category_bar',
            'state': state,
            'year': year,
            'answer': f'📊 Category Distribution for {state} ({year})\n\nThis shows the distribution of groundwater categories:\n• Safe (≤70% SGWD)\n• Semi-Critical (70-90%)\n• Critical (>90% with decline)\n• Over-Exploited (>100%)\n\nNote: Live visualization generation is available when running the local Flask server.',
            'graph': None
        }
    elif query_type == "trend":
        location_display = location if location else "All Locations"
        return {
            'query_type': 'trend',
            'state': state,
            'location': location,
            'answer': f'📈 Groundwater Extraction Trend for {state} - {location_display}\n\nThis displays groundwater extraction patterns over time.\n\nNote: Live visualization generation is available when running the local Flask server.',
            'graph': None
        }
    return None

def find_record(location, state, year):
    """Find matching record in metadata"""
    if not location or not year:
        return None

    loc_norm = normalize(location)
    year_norm = re.match(r"(\d{4})", year.replace(" ", "").replace("-", "")).group(1) if year else ""

    for record in metadata_json.values():
        record_loc_norm = normalize(record['location'])
        record_year_norm = re.match(r"(\d{4})", record['year'].replace(" ", "").replace("-", "")).group(1)

        if (loc_norm == record_loc_norm or loc_norm in record_loc_norm or
            record_loc_norm.startswith(loc_norm)) and \
           (not state or normalize(record['state']) == normalize(state)) and \
           (record_year_norm == year_norm or record_year_norm.startswith(year_norm)):
            return record

    return None

def format_groundwater_response(record):
    """Format groundwater data response"""
    if not record:
        return "No data found for the specified location and year."

    response = f"📍 {record['location']}, {record['state']} ({record['year']})\n\n"

    if record.get('sgwd') is not None:
        response += f"🌊 Groundwater Status:\n"
        response += f"• SGWD: {record['sgwd']:.1f}%\n"
        response += f"• Category: {record.get('approx_category', 'N/A')}\n"
        response += f"• Extraction: {record['ground_water_extraction_ham']:.1f} ha m\n"
        response += f"• Extractable: {record['annual_extractable_ground_water_resources_ham']:.1f} ha m\n"

    if record.get('rainfall_mm') is not None:
        response += f"\n🌧️ Rainfall: {record['rainfall_mm']:.1f} mm\n"

    return response

# Vercel serverless function handler
def handler(request):
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return jsonify({'ok': True}), 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }

    try:
        payload = request.get_json(force=True)
        q = payload.get('query', '') if isinstance(payload, dict) else ''
        lang = payload.get('lang', 'English') if isinstance(payload, dict) else 'English'

        # Parse query
        location, state, year, query_type = extract_location_and_year(q)

        response = {
            'query': q,
            'location': location,
            'state': state,
            'year': year,
            'query_type': query_type,
            'graph': None,
            'answer': None
        }

        # Handle visualization requests
        if query_type in ['category_bar', 'trend']:
            viz_response = generate_visualization_response(query_type, state, location, year)
            if viz_response:
                response.update(viz_response)
                return jsonify(response), 200, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                }

        # Handle data queries
        if location and year:
            record = find_record(location, state, year)
            if record:
                response['answer'] = format_groundwater_response(record)
            else:
                response['answer'] = f"No data found for {location} in {year}. Please check the location name and year."
        else:
            response['answer'] = "Please specify a location and year in your query. Example: 'Show data for Delhi 2024'"

        return jsonify(response), 200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }

    except Exception as e:
        return jsonify({
            'error': str(e),
            'answer': f'Error processing query: {str(e)}'
        }), 500, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }

# For Vercel
app = Flask(__name__)

@app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'OPTIONS'])
@app.route('/<path:path>', methods=['GET', 'POST', 'OPTIONS'])
def catch_all(path):
    return handler(request)
