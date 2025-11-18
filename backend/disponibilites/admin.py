from django.contrib import admin
from .models import Disponibilite

@admin.register(Disponibilite)
class DisponibiliteAdmin(admin.ModelAdmin):
    list_display = ('id', 'entreprise', 'date', 'heure_debut', 'heure_fin', 'capacite')
    list_filter = ('entreprise', 'date')
