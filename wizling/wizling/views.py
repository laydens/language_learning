import logging
from django.shortcuts import render
from .react_utility import get_asset_filenames
from django.contrib.auth.decorators import login_required

logger = logging.getLogger(__name__)

def render_flashcard_game(request):
    logger.debug("render_flashcard_game called")  # Log that the view is called
    
    asset_filenames = get_asset_filenames()
    
    # Log the asset filenames
    logger.debug(f"Asset Filenames retrieved: {asset_filenames}")
    
    # Check if main_js and main_css are empty
    if not asset_filenames.get('main_js'):
        logger.warning("main_js is empty or not found.")
    if not asset_filenames.get('main_css'):
        logger.warning("main_css is empty or not found.")
    
    return render(request, 'cards.html', asset_filenames)

@login_required
def profile_view(request):
    print("User authenticated:", request.user.is_authenticated)  # Debug print
    print("Current user:", request.user)  # Debug print
    
    logger.debug("profile_view called")  # Log that the view is called
    logger.info(f"User accessing profile: {request.user} (authenticated: {request.user.is_authenticated})")
    
    return render(request, 'profile.html', {
        'user': request.user
    })
