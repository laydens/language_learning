from django.db import models

class Flashcard(models.Model):
    question = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
