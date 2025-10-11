import json
import os
import sys
from flask import Flask, jsonify, request

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Load data.json and convert to metadata format
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'CHAT', 'data.json')

def load_metadata():
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
        return {}

    return metadata_json

# Vercel serverless function handler
def handler(request):
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return jsonify({'ok': True}), 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }

    try:
        metadata = load_metadata()
        return jsonify(metadata), 200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    except Exception as e:
        return jsonify({
            'error': str(e)
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
