from django.db import models
from django.conf import settings


class Entreprise(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='entreprise_profile'
    )
    nom = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    domaine = models.CharField(max_length=100, blank=True)
    adresse = models.CharField(max_length=255, blank=True)
    ville = models.CharField(max_length=100, blank=True)
    telephone = models.CharField(max_length=50, blank=True)
    est_valide = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom or f"Entreprise de {self.user.username}"
