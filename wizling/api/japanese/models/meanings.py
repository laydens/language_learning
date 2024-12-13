from django.db import models

class Meanings(models.Model):
    entity_id = models.IntegerField()
    entity_type = models.CharField(max_length=1)
    meaning = models.TextField()
    lang_id = models.IntegerField()
    ord = models.IntegerField()
    pos = models.CharField(max_length=50)
    context = models.TextField()
    usage_notes = models.CharField(max_length=100, null=True)

    class Meta:
        db_table = 'meanings'
        managed = False  # Prevent Django from managing this table 