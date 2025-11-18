from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'nom',
            'description',
            'duree_minutes',
            'prix',
            'est_actif',
        ]
        read_only_fields = []
