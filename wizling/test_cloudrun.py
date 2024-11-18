# test_cloudrun.py
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
import pymysql
import json

class TestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        result = self.test_connection()
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())

    def test_connection(self):
        config = {
            'user': 'llservice',
            'password': 'llservice-mysql-password',
            'db': 'language_learning_cms',
            'unix_socket': '/cloudsql/wizling:us-central1:s-layden-mysql',
            'auth_plugin': 'caching_sha2_password'
        }
        
        try:
            connection = pymysql.connect(**config)
            connection.close()
            return {"status": "success", "message": "Connected successfully"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

port = int(os.environ.get('PORT', 8080))
print(f"Starting server on port {port}")
httpd = HTTPServer(('', port), TestHandler)
httpd.serve_forever()