from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models.kanji import Kanji
from ..models.meanings import Meanings
from ..models.compounds import Compounds
from ..models.examples import Examples
from ..models.readings import Readings
import logging

logger = logging.getLogger(__name__)

class KanjiDetailAPI(APIView):
    def get(self, request, id):
        try:
            kanji = Kanji.objects.using('language_learning').get(id=id)
            kanji_detail = {
                "id": kanji.id,
                "char": kanji.kanji_char,
                "onyomi": Readings.objects.using('language_learning').filter(kanji_id=kanji.id, type='o').values_list('reading', flat=True),
                "kunyomi": Readings.objects.using('language_learning').filter(kanji_id=kanji.id, type='k').values_list('reading', flat=True),
                "level": kanji.level,
            }

            meanings = Meanings.objects.using('language_learning').filter(entity_id=id, entity_type='k').values(
                'entity_id', 'entity_type', 'meaning', 'context', 'usage_notes', 'lang_id', 'ord', 'pos'
            )

            common_compounds = Compounds.objects.using('language_learning').filter(entity_id=id, entity_type='k').values(
                'entity_id', 'entity_type', 'compound', 'reading', 'meaning', 'frequency_level', 'lang_id'
            )

            examples = Examples.objects.using('language_learning').filter(entity_id=id, entity_type='k').values(
                'entity_id', 'entity_type', 'example', 'reading', 'trans', 'lang_id'
            )

            response_data = {
                "kanji": kanji_detail,
                "meanings": list(meanings),
                "common_compounds": list(common_compounds),
                "examples": list(examples),
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Kanji.DoesNotExist:
            return Response({'error': 'Kanji not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f'[KanjiDetailAPI] Error: {str(e)}')
            return Response({'error': 'Failed to fetch kanji details', 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)