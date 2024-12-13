from django.urls import path, include
from api.japanese.flashcards.views.flashcard_api import FlashcardAPI
from api.japanese.flashcards.views.term_api import TermAPI

urlpatterns = [
    path('flashcards/', FlashcardAPI.as_view(), name='flashcard-api'),  # Flashcards endpoint
    path('japanese/flashcards/', FlashcardAPI.as_view(), name='japanese-flashcards'),  # Japanese flashcards endpoint
    path('japanese/vocab/<int:id>/', TermAPI.as_view(), name='get_term_by_id'),  # Term retrieval endpoint
]