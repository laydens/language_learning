import json
import os

def get_asset_filenames():
    # Use BASE_DIR to construct an absolute path
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    manifest_path = os.path.join(base_dir, 'frontend', 'build', 'asset-manifest.json')
    
    print(f"Attempting to open: {manifest_path}")  # Debugging line
    try:
        with open(manifest_path, 'r') as f:
            manifest = json.load(f)
        
        # Access the 'files' dictionary to get the correct paths
        files = manifest.get('files', {})
        return {
            'main_js': files.get('main.js'),
            'main_css': files.get('main.css'),
        }
    except FileNotFoundError:
        print(f"File not found: {manifest_path}")
        # Handle the error appropriately
        return {}
 