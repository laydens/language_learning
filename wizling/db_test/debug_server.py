import http.server
import socketserver
import os
import json
import pymysql.connections
import subprocess
from dotenv import load_dotenv

load_dotenv()

class DebugHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"OK")
            return

        if self.path == '/debug':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            socket_path = os.getenv('DB_HOST', '/cloudsql/wizling:us-central1:s-layden-mysql')
            
            debug_info = {
                'socket_info': {
                    'path': socket_path,
                    'exists': os.path.exists(socket_path),
                    'dir_exists': os.path.exists('/cloudsql'),
                    'dir_contents': os.listdir('/cloudsql') if os.path.exists('/cloudsql') else None,
                    'full_ls': subprocess.getoutput('ls -la /cloudsql'),
                    'socket_dir_path': os.path.dirname(socket_path),
                    'socket_base_name': os.path.basename(socket_path)
                }
            }
            
            try:
                # Force Unix socket connection
                connection = pymysql.connections.Connection(
                    unix_socket=socket_path,
                    user=os.getenv('DB_USER'),
                    password=os.getenv('DB_PASSWORD'),
                    database=os.getenv('CMS_DB'),
                    host=None,  # Explicitly set to None
                    port=None   # Explicitly set to None
                )
                
                debug_info['connection_attempt'] = {
                    'unix_socket': socket_path,
                    'user': os.getenv('DB_USER'),
                    'database': os.getenv('CMS_DB'),
                    'host': None,
                    'port': None, 
                    'version': "1.0"
                }
                
                cursor = connection.cursor()
                cursor.execute('SELECT DATABASE(), USER(), @@socket, VERSION()')
                result = cursor.fetchone()
                debug_info['db_connection'] = 'success'
                debug_info['db_info'] = {
                    'database': result[0],
                    'user': result[1],
                    'socket_used': result[2],
                    'version': result[3]
                }
                connection.close()
            except Exception as e:
                debug_info['db_connection'] = 'failed'
                debug_info['db_error'] = str(e)
                debug_info['error_details'] = repr(e)
                debug_info['error_type'] = type(e).__name__
            
            self.wfile.write(json.dumps(debug_info, default=str).encode())
            return

port = int(os.getenv("PORT", 8080))
with socketserver.TCPServer(("", port), DebugHandler) as httpd:
    print(f"Debug server running on port {port} \n")

    httpd.serve_forever()