from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from ...services.japanese_term_service import JapaneseTermService
import logging
import re
import json

logger = logging.getLogger(__name__)

class FlashcardAPI(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        try:
            num_cards = int(request.query_params.get('num_cards', 5))
            level = request.query_params.get('level', 'beginner')
            
            terms = JapaneseTermService.get_random_terms(level, num_cards)
            
            cards = [{
                'id': term['id'],
                'expression': term['expr'],
                'reading': term['reading'],
                'meanings': [
                    {
                        'meaning': m['meaning'],
                        'notes': m['usage_notes']
                    }
                    for m in json.loads(term['meanings'])
                ],
                'level': term['level']
            } for term in terms]

            return Response(cards, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f'[FlashcardAPI] Error: {str(e)}')
            return Response(
                {'error': 'Failed to fetch flashcards', 'detail': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def parse_meanings(self, meanings_text):
        """Parse meanings text into meaning and usage notes pairs"""
        if not meanings_text:
            return []
            
        meanings = []
        for line in meanings_text.split('\n'):
            if not line.strip():
                continue
            # Remove ordinal number
            line = re.sub(r'^\d+\.\s*', '', line)
            # Split meaning and notes
            parts = re.match(r'(.*?)(?:\s*\((.*?)\))?$', line)
            if parts:
                meanings.append((parts.group(1), parts.group(2)))
        
        return meanings
