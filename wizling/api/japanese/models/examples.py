from django.db import models
from ...core.db.base_models import TimeStampedModel

class Examples(models.Model):
    entity_id = models.IntegerField()
    entity_type = models.CharField(max_length=1)
    example = models.TextField()
    reading = models.TextField(null=True)
    trans = models.TextField(null=True)
    lang_id = models.IntegerField()

    class Meta:
        db_table = 'examples'
        managed = False  # Prevent Django from managing this table 