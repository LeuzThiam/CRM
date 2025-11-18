from rest_framework import serializers
from datetime import datetime, timedelta
from .models import Reservation
from entreprises.models import Entreprise
from services_app.models import Service
from disponibilites.models import Disponibilite
from clients.models import Client


class ReservationSerializer(serializers.ModelSerializer):
    entreprise_nom = serializers.CharField(source='entreprise.nom', read_only=True)
    client_username = serializers.CharField(source='client.user.username', read_only=True)
    service_nom = serializers.CharField(source='service.nom', read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id',
            'entreprise',
            'entreprise_nom',
            'client',
            'client_username',
            'service',
            'service_nom',
            'date',
            'heure_debut',
            'heure_fin',
            'statut',
            'commentaire_client',
            'commentaire_entreprise',
            'date_creation',
        ]
        read_only_fields = [
            'entreprise',
            'client',
            'service',
            'date',
            'heure_debut',
            'heure_fin',
            'commentaire_client',
            'date_creation',
        ]


class ReservationCreateSerializer(serializers.ModelSerializer):
    entreprise_id = serializers.IntegerField(write_only=True)
    service_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id',
            'entreprise_id',
            'service_id',
            'date',
            'heure_debut',
            'commentaire_client',
        ]

    def validate(self, attrs):
        entreprise_id = attrs.get('entreprise_id')
        service_id = attrs.get('service_id')
        date = attrs.get('date')
        heure_debut = attrs.get('heure_debut')

        try:
            entreprise = Entreprise.objects.get(id=entreprise_id)
        except Entreprise.DoesNotExist:
            raise serializers.ValidationError('Entreprise invalide.')

        try:
            service = Service.objects.get(id=service_id, entreprise=entreprise, est_actif=True)
        except Service.DoesNotExist:
            raise serializers.ValidationError('Service invalide pour cette entreprise.')

        dt_start = datetime.combine(date, heure_debut)
        dt_end = dt_start + timedelta(minutes=service.duree_minutes)
        heure_fin = dt_end.time()

        dispo_qs = Disponibilite.objects.filter(
            entreprise=entreprise,
            date=date,
            heure_debut__lte=heure_debut,
            heure_fin__gte=heure_fin,
        )
        if not dispo_qs.exists():
            raise serializers.ValidationError('Aucun creneau disponible pour cette date et heure.')

        dispo = dispo_qs.first()
        existing_count = Reservation.objects.filter(
            entreprise=entreprise,
            date=date,
            heure_debut__gte=dispo.heure_debut,
            heure_fin__lte=dispo.heure_fin,
        ).count()

        if existing_count >= dispo.capacite:
            raise serializers.ValidationError('Ce creneau est complet.')

        attrs['entreprise'] = entreprise
        attrs['service'] = service
        attrs['heure_fin'] = heure_fin

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        try:
            client = Client.objects.get(user=user)
        except Client.DoesNotExist:
            raise serializers.ValidationError('Profil client introuvable.')

        entreprise = validated_data.pop('entreprise')
        service = validated_data.pop('service')
        heure_fin = validated_data.pop('heure_fin')

        reservation = Reservation.objects.create(
            entreprise=entreprise,
            client=client,
            service=service,
            heure_fin=heure_fin,
            **validated_data,
        )
        return reservation
