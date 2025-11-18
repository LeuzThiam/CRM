from django.contrib import admin
from .models import Entreprise

@admin.register(Entreprise)
class EntrepriseAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom', 'domaine', 'ville', 'est_valide', 'date_creation')
    search_fields = ('nom', 'domaine', 'ville')
    list_filter = ('est_valide', 'ville', 'domaine')
