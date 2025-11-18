from django.db import models
from entreprises.models import Entreprise
from clients.models import Client
from services_app.models import Service


class Reservation(models.Model):
    STATUT_EN_ATTENTE = 'en_attente'
    STATUT_CONFIRME = 'confirme'
    STATUT_ANNULE = 'annule'
    STATUT_TERMINE = 'termine'

    STATUT_CHOICES = [
        (STATUT_EN_ATTENTE, 'En attente'),
        (STATUT_CONFIRME, 'Confirme'),
        (STATUT_ANNULE, 'Annule'),
        (STATUT_TERMINE, 'Termine'),
    ]

    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name='reservations'
    )
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='reservations'
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        null=True,
        related_name='reservations'
    )
    date = models.DateField()
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default=STATUT_EN_ATTENTE,
    )
    commentaire_client = models.TextField(blank=True)
    commentaire_entreprise = models.TextField(blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reservation {self.id} - {self.entreprise.nom} / {self.client.user.username}"
