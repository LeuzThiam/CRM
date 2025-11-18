from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CLIENT = 'client'
    ROLE_ENTREPRISE = 'entreprise'

    ROLE_CHOICES = [
        (ROLE_CLIENT, 'Client'),
        (ROLE_ENTREPRISE, 'Entreprise'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_CLIENT)

    def __str__(self):
        return f"{self.username} ({self.role})"
