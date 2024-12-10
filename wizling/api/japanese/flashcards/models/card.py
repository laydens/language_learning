from django.db import models
from core.db.base_models import TimeStampedModel
from .deck import Deck

class Card(TimeStampedModel):
    deck = models.ForeignKey(Deck, related_name='cards', on_delete=models.CASCADE)
    front_content = models.TextField()
    back_content = models.TextField()

    def __str__(self):
        return f"Card for {self.deck.name}"
