from django.contrib.auth.models import AbstractUser
from django.db import models


# class Flashcard(models.Model):
#     question = models.CharField(max_length=255)
#     answer = models.CharField(max_length=255)

class CustomUser(AbstractUser):
       username = models.EmailField(unique=True, null=True, blank=True)  # Allow null usernames
       email = models.EmailField(unique=True)

       USERNAME_FIELD = 'email'  # Use email for authentication
       REQUIRED_FIELDS = []  # No required fields other than email