from django.contrib import admin
from .models import Reservation

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'entreprise',
        'client',
        'service',
        'date',
        'heure_debut',
        'heure_fin',
        'statut',
        'date_creation',
    )
    list_filter = ('entreprise', 'date', 'statut')
    search_fields = ('entreprise__nom', 'client__user__username', 'service__nom')
