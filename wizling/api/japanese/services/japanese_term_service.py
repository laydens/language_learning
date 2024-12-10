from typing import List, Optional
from ..models.term import Term
from django.db.models import Prefetch
from django.db import connections
import logging

logger = logging.getLogger(__name__)

class JapaneseTermService:
    @staticmethod
    def get_term(expr: str) -> Optional[Term]:
        try:
            return Term.objects.using('language_learning').get(expr=expr)
        except Term.DoesNotExist:
            return None

    @staticmethod
    def search_terms(query: str, limit: int = 10) -> List[Term]:
        return list(Term.objects.filter(expression__icontains=query)[:limit])

    @staticmethod
    def get_random_terms(level: str, limit: int = 50) -> List[dict]:
        """Fetch random terms with their meanings"""
        level_mapping = {
            'beginner': ['N5', 'N4'],
            'intermediate': ['N3', 'N2'],
            'advanced': ['N1']
        }
        db_levels = level_mapping.get(level, ['N5'])
        
        query = """
            SELECT 
                v.id, 
                v.expr, 
                v.reading,
                v.level,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'ord', m.ord,
                        'meaning', m.meaning,
                        'usage_notes', NULLIF(m.usage_notes, '')
                    )
                ) as meanings
            FROM vocab v
            LEFT JOIN meanings m 
                ON v.id = m.entity_id 
                AND m.entity_type = 'v'
                AND m.lang_id = 1
            WHERE v.level IN %s 
                AND v.lang_id = 1
            GROUP BY v.id, v.expr, v.reading, v.level
            ORDER BY RAND()
            LIMIT %s
        """
        
        with connections['language_learning'].cursor() as cursor:
            cursor.execute(query, [tuple(db_levels), limit])
            columns = [col[0] for col in cursor.description]
            terms = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            # Log sample term for debugging
            if terms:
                logger.info(f"Sample term: {terms[0]}")
            
        return terms
