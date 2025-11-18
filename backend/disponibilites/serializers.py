from rest_framework import serializers
from .models import Disponibilite


class DisponibiliteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disponibilite
        fields = [
            'id',
            'entreprise',
            'date',
            'heure_debut',
            'heure_fin',
            'capacite',
        ]
        read_only_fields = ['entreprise']
