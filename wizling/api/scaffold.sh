#!/bin/bash

# Create base directories
mkdir -p languages/models
mkdir -p languages/services
mkdir -p japanese/models
mkdir -p japanese/services
mkdir -p japanese/flashcards/models
mkdir -p japanese/flashcards/serializers
mkdir -p japanese/flashcards/services
mkdir -p core/db
mkdir -p core/utils

# Create __init__.py files
touch __init__.py
touch languages/__init__.py
touch languages/models/__init__.py
touch languages/services/__init__.py
touch japanese/__init__.py
touch japanese/models/__init__.py
touch japanese/services/__init__.py
touch japanese/flashcards/__init__.py
touch japanese/flashcards/models/__init__.py
touch japanese/flashcards/serializers/__init__.py
touch japanese/flashcards/services/__init__.py
touch core/__init__.py
touch core/db/__init__.py
touch core/utils/__init__.py

# Create models based on the schema
cat <<EOL > languages/models/language.py
from django.db import models

class Language(models.Model):
    code = models.CharField(max_length=10)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
EOL

cat <<EOL > japanese/models/term.py
from django.db import models
from core.db.base_models import TimeStampedModel

class Term(TimeStampedModel):
    expression = models.CharField(max_length=255)
    reading = models.CharField(max_length=255)
    frequency = models.IntegerField(null=True)

    def __str__(self):
        return self.expression
EOL

cat <<EOL > japanese/models/definition.py
from django.db import models
from core.db.base_models import TimeStampedModel
from .term import Term

class Definition(TimeStampedModel):
    term = models.ForeignKey(Term, related_name='definitions', on_delete=models.CASCADE)
    meaning = models.TextField()
    part_of_speech = models.CharField(max_length=50)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.meaning} ({self.part_of_speech})"
EOL

cat <<EOL > japanese/flashcards/models/deck.py
from django.db import models
from core.db.base_models import TimeStampedModel
from django.conf import settings

class Deck(TimeStampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.name
EOL

cat <<EOL > japanese/flashcards/models/card.py
from django.db import models
from core.db.base_models import TimeStampedModel
from .deck import Deck

class Card(TimeStampedModel):
    deck = models.ForeignKey(Deck, related_name='cards', on_delete=models.CASCADE)
    front_content = models.TextField()
    back_content = models.TextField()

    def __str__(self):
        return f"Card for {self.deck.name}"
EOL

# Create services
cat <<EOL > japanese/services/japanese_term_service.py
from typing import List, Optional
from .models.term import Term

class JapaneseTermService:
    @staticmethod
    def get_term(expression: str) -> Optional[Term]:
        try:
            return Term.objects.get(expression=expression)
        except Term.DoesNotExist:
            return None

    @staticmethod
    def search_terms(query: str, limit: int = 10) -> List[Term]:
        return list(Term.objects.filter(expression__icontains=query)[:limit])
EOL

cat <<EOL > japanese/flashcards/services/flashcard_service.py
from typing import List
from .models.deck import Deck
from .models.card import Card
from ..services.japanese_term_service import JapaneseTermService

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
EOL

# Create utilities if needed
cat <<EOL > core/utils/pagination.py
from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
EOL

echo "API scaffolding created successfully!"