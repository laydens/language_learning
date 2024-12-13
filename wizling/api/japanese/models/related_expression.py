from django.db import models
from ...core.db.base_models import TimeStampedModel

class RelatedExpression(models.Model):
    entity_id = models.IntegerField()
    expression = models.CharField(max_length=50)
    reading = models.CharField(max_length=50, null=True)
    meaning = models.CharField(max_length=100, null=True)
    frequency_level = models.CharField(max_length=1)  # Adjust based on your schema

    class Meta:
        db_table = 'related_expressions'
        managed = False  # Prevent Django from managing this table 