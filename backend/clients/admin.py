from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'telephone', 'date_creation')
    search_fields = ('user__username', 'user__email')
