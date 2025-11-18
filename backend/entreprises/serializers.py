from rest_framework import serializers
from .models import Entreprise


class EntreprisePublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entreprise
        fields = [
            'id',
            'nom',
            'description',
            'domaine',
            'adresse',
            'ville',
            'telephone',
            'est_valide',
        ]


class EntrepriseProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entreprise
        fields = [
            'id',
            'nom',
            'description',
            'domaine',
            'adresse',
            'ville',
            'telephone',
            'est_valide',
            'date_creation',
        ]
        read_only_fields = ['est_valide', 'date_creation']
