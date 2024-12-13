from django.db import models

class Kanji(models.Model):
    """
    Represents a Kanji character in the language_learning database.
    """
    id = models.AutoField(primary_key=True)
    kanji_char = models.CharField(max_length=1, unique=True)
    strokes = models.IntegerField()
    grade = models.IntegerField()
    level = models.CharField(max_length=10)
    level_system_id = models.IntegerField()
    freq_rank = models.IntegerField()
    lang_id = models.IntegerField()

    class Meta:
        db_table = 'kanji'
        managed = False  # Prevent Django from managing this table

    def __str__(self):
        return self.kanji_char