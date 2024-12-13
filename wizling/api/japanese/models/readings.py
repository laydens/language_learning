from django.db import models


class Readings(models.Model):
    kanji_id = models.IntegerField()
    reading = models.CharField(max_length=10)
    type = models.CharField(max_length=1)  # Adjust based on your schema

    class Meta:
        db_table = 'readings'
        managed = False  # Prevent Django from managing this table 