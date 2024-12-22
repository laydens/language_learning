from django.db import models

class Compounds(models.Model):
    entity_id = models.IntegerField()
    entity_type = models.CharField(max_length=1)
    compound = models.CharField(max_length=50)
    reading = models.CharField(max_length=50)
    meaning = models.CharField(max_length=100)
    frequency_level = models.CharField(max_length=1)  # Adjust based on your schema
    lang_id = models.IntegerField()

    class Meta:
        db_table = 'compounds'
        managed = False  # Prevent Django from managing this table

    def __str__(self):
        return self.compound
