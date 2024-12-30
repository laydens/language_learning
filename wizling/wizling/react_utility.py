import json
import os

def get_asset_filenames():
    # Determine if running in Docker or locally
    is_docker = os.environ.get('IS_DOCKER', False)

    if is_docker:
        # In Docker, use the staticfiles directory
        manifest_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'staticfiles', 'asset-manifest.json')
    else:
        # Locally, use the frontend/build directory
        manifest_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend', 'build', 'asset-manifest.json')

    print(f"Attempting to open: {manifest_path}")
    try:
        with open(manifest_path, 'r') as f:
            manifest = json.load(f)

        files = manifest.get('files', {})
        return {
            'main_js': files.get('main.js'),
            'main_css': files.get('main.css'),
        }
    except FileNotFoundError:
        print(f"File not found: {manifest_path}")
        return {}
 