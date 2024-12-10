from django.urls import path, include
from api.japanese.flashcards.views.flashcard_api import FlashcardAPI

urlpatterns = [
    path('flashcards/', FlashcardAPI.as_view(), name='flashcard-api'),
    path('api/japanese/flashcards/', FlashcardAPI.as_view(), name='japanese-flashcards'),
    # Add other API endpoints here as needed
]
