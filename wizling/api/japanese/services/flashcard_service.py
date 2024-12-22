from typing import Dict, List, Optional
from django.db.models import Q
from ..models.deck import Deck
from ..models.card import Card
from ...models.meanings import Meanings
from ...models.examples import Examples
from ...models.kanji import Kanji
from ...models.readings import Readings
from ..services.term_service import JapaneseTermService
from ...models.related_expression import RelatedExpression
from ...models.memory_hooks import MemoryHooks

class FlashcardService:
    def __init__(self, term_service: JapaneseTermService):
        self.term_service = term_service

    def create_deck(self, terms: List[str], user, deck_name: str) -> Deck:
        deck = Deck.objects.create(name=deck_name, owner=user)
        for term in terms:
            term_obj = self.term_service.get_term(term)
            if term_obj:
                Card.objects.create(
                    deck=deck,
                    front_content=term_obj.expression,
                    back_content=term_obj.reading
                )
        return deck

    def get_vocabulary_detail(self, vocab_id: int) -> Dict:
        """Fetch complete vocabulary details including related information."""
        vocab = Vocab.objects.get(id=vocab_id)
        
        # Get all meanings with POS
        meanings = Meanings.objects.filter(
            entity_id=vocab_id,
            entity_type='v'
        ).order_by('ord')

        # Get example sentences
        examples = Examples.objects.filter(
            entity_id=vocab_id,
            entity_type='v'
        )

        # Get kanji breakdown if applicable
        kanji_details = []
        for char in vocab.expr:
            if any(0x4E00 <= ord(c) <= 0x9FFF for c in char):  # Is kanji
                kanji = Kanji.objects.filter(kanji_char=char).first()
                if kanji:
                    readings = Readings.objects.filter(kanji_id=kanji.id)
                    kanji_details.append({
                        'character': char,
                        'meanings': [m.meaning for m in Meanings.objects.filter(
                            entity_id=kanji.id,
                            entity_type='k'
                        )],
                        'readings': [r.reading for r in readings]
                    })

        # Get memory hooks
        memory_hooks = MemoryHooks.objects.filter(
            entity_id=vocab_id,
            entity_type='v'
        )

        # Get related expressions
        related = RelatedExpression.objects.filter(
            entity_id=vocab_id,
            entity_type='v'
        )

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
            'memory_hooks': [{
                'hook': h.hook,
                'category': h.category
            } for h in memory_hooks],
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
