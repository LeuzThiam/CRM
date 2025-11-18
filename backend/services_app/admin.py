from django.contrib import admin
from .models import Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom', 'entreprise', 'duree_minutes', 'prix', 'est_actif')
    list_filter = ('entreprise', 'est_actif')
    search_fields = ('nom', 'entreprise__nom')
