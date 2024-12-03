from django.shortcuts import render
from .react_utility import get_asset_filenames

def render_flashcard_game(request):
    asset_filenames = get_asset_filenames()
    return render(request, 'cards.html', asset_filenames)
