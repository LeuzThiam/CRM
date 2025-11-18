from django.db import models
from entreprises.models import Entreprise


class Service(models.Model):
    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name='services'
    )
    nom = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duree_minutes = models.PositiveIntegerField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    est_actif = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nom} - {self.entreprise.nom}"
