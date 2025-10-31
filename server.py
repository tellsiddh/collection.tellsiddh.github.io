#!/usr/bin/env python3
"""
Simple HTTP server for testing the PWA locally
Run with: python3 server.py
"""
import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for testing
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        super().end_headers()
    
    def guess_type(self, path):
        # Set correct MIME types
        mimetype, encoding = super().guess_type(path)
        
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.json'):
            return 'application/json'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.html'):
            return 'text/html'
        
        return mimetype

def main():
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Server running at http://localhost:{PORT}")
        print(f"📱 To test PWA: Open Chrome/Edge and go to http://localhost:{PORT}")
        print(f"📲 To install: Look for the install icon in the address bar")
        print(f"🔄 Press Ctrl+C to stop")
        
        try:
            # Auto-open browser
            webbrowser.open(f"http://localhost:{PORT}")
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")

if __name__ == "__main__":
    main()