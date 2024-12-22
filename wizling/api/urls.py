from django.urls import path
from api.japanese.views.term_api import TermAPI
from api.japanese.views.kanji_api import KanjiDetailAPI
from api.japanese.views.flashcard_api import FlashcardAPI

urlpatterns = [
    path('japanese/vocab/<int:id>/', TermAPI.as_view(), name='get_term_by_id'),  # Term retrieval endpoint
    path('japanese/kanji/<int:id>/', KanjiDetailAPI.as_view(), name='get_kanji_by_id'),  # Kanji retrieval endpoint
    path('flashcards/', FlashcardAPI.as_view(), name='flashcard-api'),  # Flashcards endpoint
    path('japanese/flashcards/', FlashcardAPI.as_view(), name='japanese-flashcards'),  # Japanese flashcards endpoint
]