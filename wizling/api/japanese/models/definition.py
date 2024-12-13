from django.db import models
from .term import Term

class Definition(models.Model):
    term = models.ForeignKey(Term, related_name='definitions', on_delete=models.CASCADE)
    meaning = models.TextField()
    part_of_speech = models.CharField(max_length=50)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.meaning} ({self.part_of_speech})"
