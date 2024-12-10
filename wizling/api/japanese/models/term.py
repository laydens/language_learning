from django.db import models
from api.core.db.base_models import TimeStampedModel

class Term(TimeStampedModel):
    """
    Represents a Japanese vocabulary term from the language_learning database.
    Maps to the 'vocab' table.
    """
    TERM_TYPES = [
        ('word', 'Word'),
        ('phrase', 'Phrase'),
        ('idiom', 'Idiom')
    ]

    id = models.AutoField(primary_key=True)
    expr = models.CharField(max_length=50)
    reading = models.CharField(max_length=50, null=True)
    romaji = models.CharField(max_length=100, null=True)
    lang_id = models.IntegerField(null=True)
    level = models.CharField(max_length=10, null=True)
    level_system_id = models.IntegerField(null=True)
    freq_rank = models.IntegerField(null=True)
    type = models.CharField(max_length=10, choices=TERM_TYPES, default='word')
    pos = models.CharField(max_length=50, null=True)

    class Meta:
        app_label = 'api_japanese'
        db_table = 'vocab'
        managed = False

    def __str__(self):
        return f"{self.expr} ({self.reading})"
