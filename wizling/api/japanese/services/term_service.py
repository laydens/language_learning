from typing import List, Optional, Dict
from ..models.term import Term  # Assuming this is your Term model
from ..models.meanings import Meanings  # Assuming you have a Meanings model
from ..models.examples import Examples  # Assuming you have an Examples model
from ..models.kanji import Kanji  # Assuming you have a Kanji model
from ..models.related_expression import RelatedExpression  # Assuming you have a RelatedExpression model
from ..models.readings import Readings  # Assuming you have a Readings model

import logging

logger = logging.getLogger(__name__)

class JapaneseTermService:
    @staticmethod
    def get_term_by_id(term_id: int) -> Optional[Term]:
        """Fetch a term by its ID."""
        try:
            return Term.objects.get(id=term_id)  # This will not change the database
        except Term.DoesNotExist:
            return None

    @staticmethod
    def get_vocabulary_detail(vocab_id: int) -> Optional[Dict]:
        """Fetch complete vocabulary details including related information."""
        try:
            vocab = Term.objects.using('language_learning').get(id=vocab_id)  # Fetch term using ORM

            # Get all meanings
            meanings = Meanings.objects.using('language_learning').filter(entity_id=vocab_id, entity_type='v').order_by('ord')

            # Get example sentences
            examples = Examples.objects.using('language_learning').filter(entity_id=vocab_id)

            # Get kanji breakdown if applicable
            kanji_details = []
            for char in vocab.expr:
                if any(0x4E00 <= ord(c) <= 0x9FFF for c in char):  # Check if character is kanji
                    kanji = Kanji.objects.using('language_learning').filter(kanji_char=char).first()
                    if kanji:
                        readings = Readings.objects.using('language_learning').filter(kanji_id=kanji.id)
                        kanji_details.append({
                            'character': char,
                            'meanings': [m.meaning for m in Meanings.objects.using('language_learning').filter(entity_id=kanji.id)],
                            'readings': [r.reading for r in readings]
                        })

            # Get related expressions
            related = RelatedExpression.objects.using('language_learning').filter(entity_id=vocab_id)

            return {
                'id': vocab.id,
                'expression': vocab.expr,
                'reading': vocab.reading,
                'romaji': vocab.romaji,
                'level': vocab.level,
                'freq_rank': vocab.freq_rank,
                'pos': vocab.pos,
                'meanings': [{
                    'meaning': m.meaning,
                    'pos': m.pos,
                    'context': m.context,
                    'usage_notes': m.usage_notes
                } for m in meanings],
                'kanji_breakdown': kanji_details,
                'examples': [{
                    'example': e.example,
                    'reading': e.reading,
                    'translation': e.trans
                } for e in examples],
                'related_terms': [{
                    'expression': r.expression,
                    'reading': r.reading,
                    'meaning': r.meaning,
                    'frequency_level': r.frequency_level
                } for r in related]
            }
        except Term.DoesNotExist:
            return None
        except Exception as e:
            logger.error(f"Error fetching vocabulary details: {str(e)}")
            return None

    @staticmethod
    def get_random_terms(level: str = 'beginner', num_cards: int = 5) -> List[Dict]:
        """
        Retrieve random terms based on specified level and number of cards,
        including their meanings from the language_learning database.
        
        Args:
            level (str): Difficulty level of terms (default: 'beginner')
            num_cards (int): Number of random terms to retrieve (default: 5)
        
        Returns:
            List[Dict]: A list of random terms with their details and meanings
        """
        level_mapping = {
            'beginner': ['N5', 'N4'],
            'intermediate': ['N3', 'N2'],
            'advanced': ['N1']
        }

        # Get the corresponding levels from the mapping
        db_levels = level_mapping.get(level, ['N5'])

        try:
            # Filter terms by the mapped levels and order randomly, then limit to num_cards
            random_terms = list(Term.objects.using('language_learning').filter(level__in=db_levels).order_by('?')[:num_cards])
            
            # Fetch meanings for each term
            for term in random_terms:
                term.meanings = list(Meanings.objects.using('language_learning').filter(entity_id=term.id, entity_type='v').values(
                    'meaning', 'usage_notes'
                ))
            
            # Prepare the final list of terms with meanings
            terms_with_meanings = [{
                'id': term.id,
                'expr': term.expr,
                'reading': term.reading,
                'meanings': term.meanings,
                'level': term.level
            } for term in random_terms]

            return terms_with_meanings
        
        except Exception as e:
            logger.error(f"Error retrieving random terms: {str(e)}")
            return []
