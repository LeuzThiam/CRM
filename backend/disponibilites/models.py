from django.db import models
from entreprises.models import Entreprise


class Disponibilite(models.Model):
    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name='disponibilites'
    )
    date = models.DateField()
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    capacite = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.entreprise.nom} - {self.date} {self.heure_debut}-{self.heure_fin}"
