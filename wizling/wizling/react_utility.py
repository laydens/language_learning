import json
import os

def get_asset_filenames():
    # Determine if running in Docker or locally
    is_docker = os.environ.get('IS_DOCKER', False)

    if is_docker:
        # In Docker, use the staticfiles directory
        manifest_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'staticfiles', 'asset-manifest.json')
        # Return paths with 'static/' prefix for Docker
        static_prefix = '/static/'
    else:
        # Locally, use the frontend/build directory
        manifest_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend', 'build', 'asset-manifest.json')
        # No prefix for local development
        static_prefix = ''

    print(f"Attempting to open manifest file: {manifest_path}")
    try:
        with open(manifest_path, 'r') as f:
            manifest = json.load(f)

        files = manifest.get('files', {})
        return {
            'main_js': f'{static_prefix}{files.get("main.js")}',  # Use the prefix based on the environment
            'main_css': f'{static_prefix}{files.get("main.css")}',  # Use the prefix based on the environment
        }
    except FileNotFoundError:
        print(f"File not found: {manifest_path}")
        return {}
 