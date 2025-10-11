from http.server import BaseHTTPRequestHandler
import json
import os

# Load data.json and convert to metadata format
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'CHAT', 'data.json')

def load_metadata():
    metadata_json = {}
    try:
        with open(DATA_PATH, "r", encoding='utf-8') as f:
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

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        try:
            metadata = load_metadata()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(metadata).encode('utf-8'))
        except Exception as e:
            error_response = {'error': str(e)}
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
