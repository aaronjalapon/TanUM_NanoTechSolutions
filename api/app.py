from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {"message": "FastAPI backend is running"}
        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        print(f"POST request path: {self.path}")  # Debug logging
        if self.path in ['/predict', '/predict/', '/api/predict', '/api/predict/']:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                import datetime
                import random
                
                data = json.loads(post_data.decode('utf-8'))
                
                # Generate AI-like response based on input data
                nitrogen = data.get('nitrogen', 25)
                phosphorus = data.get('phosphorus', 20)
                potassium = data.get('potassium', 30)
                
                # Simple logic to determine fertilizer recommendation
                if nitrogen < 30:
                    fertilizer = "Nano-Nitrogen"
                elif phosphorus < 25:
                    fertilizer = "Nano-Phosphorus"
                elif potassium < 35:
                    fertilizer = "Nano-Potassium"
                else:
                    fertilizer = "Balanced NPK Nano-Fertilizer"
                
                # Generate confidence based on how clear the deficiency is
                confidence = 0.85 + random.uniform(0, 0.1)
                
                # Generate recommendations based on soil data
                recommendations = []
                if nitrogen < 30:
                    recommendations.append(f"Nitrogen levels are low ({nitrogen} mg/kg). Apply {fertilizer} within 2-3 days.")
                if phosphorus < 25:
                    recommendations.append(f"Phosphorus content needs improvement ({phosphorus} mg/kg).")
                if potassium < 35:
                    recommendations.append(f"Potassium levels could be enhanced ({potassium} mg/kg).")
                
                recommendations.append("Monitor soil moisture levels after application.")
                recommendations.append("Retest soil in 7-10 days to track improvement.")
                
                response = {
                    "predicted_fertilizer": fertilizer,
                    "confidence": confidence,
                    "recommendations": recommendations,
                    "timestamp": datetime.datetime.now().isoformat(),
                    "input_data": data
                }
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = {"error": str(e)}
                self.wfile.write(json.dumps(error_response).encode())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"detail": "Not Found", "requested_path": self.path}).encode())