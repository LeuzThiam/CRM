from rest_framework import serializers
from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'telephone', 'date_creation']
        read_only_fields = ['date_creation']


class ClientProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', required=False, allow_blank=True)
    last_name = serializers.CharField(source='user.last_name', required=False, allow_blank=True)

    class Meta:
        model = Client
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'telephone',
            'date_creation',
        ]
        read_only_fields = ['id', 'username', 'email', 'date_creation']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Mettre à jour les champs du client
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Mettre à jour les champs de l'utilisateur
        user = instance.user
        if user_data:
            for attr, value in user_data.items():
                if value:  # Ne mettre à jour que si une valeur est fournie
                    setattr(user, attr, value)
            user.save()
        
        return instance
