from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..services.term_service import JapaneseTermService
import logging

logger = logging.getLogger(__name__)

class TermAPI(APIView):
    def get(self, request, id):
        try:
            term_details = JapaneseTermService().get_vocabulary_detail(id)
            if term_details:
                return Response(term_details, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Term not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f'[TermAPI] Error: {str(e)}')
            return Response({'error': 'Failed to fetch term details', 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)