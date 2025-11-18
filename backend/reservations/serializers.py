from rest_framework import serializers
from datetime import datetime, timedelta
from .models import Reservation
from entreprises.models import Entreprise
from services_app.models import Service
from disponibilites.models import Disponibilite
from clients.models import Client


class ReservationSerializer(serializers.ModelSerializer):
    entreprise = serializers.SerializerMethodField()
    client = serializers.SerializerMethodField()
    service = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            'id',
            'entreprise',
            'client',
            'service',
            'date',
            'heure_debut',
            'heure_fin',
            'statut',
            'commentaire_client',
            'commentaire_entreprise',
            'date_creation',
        ]
        read_only_fields = [
            'id',
            'entreprise',
            'client',
            'service',
            'date',
            'heure_debut',
            'heure_fin',
            'commentaire_client',
            'date_creation',
        ]

    def get_entreprise(self, obj):
        if obj.entreprise:
            return {
                'id': obj.entreprise.id,
                'nom': obj.entreprise.nom,
            }
        return None

    def get_client(self, obj):
        if obj.client and obj.client.user:
            return {
                'id': obj.client.id,
                'username': obj.client.user.username,
                'email': obj.client.user.email,
            }
        return None

    def get_service(self, obj):
        if obj.service:
            return {
                'id': obj.service.id,
                'nom': obj.service.nom,
                'description': obj.service.description,
                'prix': str(obj.service.prix),
                'duree_minutes': obj.service.duree_minutes,
            }
        return None


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

        # Validation : pas de réservation dans le passé
        from datetime import date as date_class, datetime, time
        today = date_class.today()
        now = datetime.now().time()
        
        if date < today:
            raise serializers.ValidationError('Impossible de réserver une date passée.')
        
        if date == today and heure_debut < now:
            raise serializers.ValidationError('Impossible de réserver un créneau passé.')

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
        if not dispo:
            raise serializers.ValidationError('Aucun creneau disponible pour cette date et heure.')
        
        # Vérifier les conflits de réservation pour ce client
        request = self.context.get('request')
        if request and request.user:
            from clients.models import Client
            try:
                client = Client.objects.get(user=request.user)
                # Vérifier si le client a déjà une réservation à ce moment
                conflicting_reservations = Reservation.objects.filter(
                    client=client,
                    date=date,
                    statut__in=[Reservation.STATUT_EN_ATTENTE, Reservation.STATUT_CONFIRME],
                ).exclude(
                    heure_fin__lte=heure_debut
                ).exclude(
                    heure_debut__gte=heure_fin
                )
                
                if conflicting_reservations.exists():
                    raise serializers.ValidationError('Vous avez déjà une réservation à ce moment.')
            except Client.DoesNotExist:
                pass

        existing_count = Reservation.objects.filter(
            entreprise=entreprise,
            date=date,
            statut__in=[Reservation.STATUT_EN_ATTENTE, Reservation.STATUT_CONFIRME],
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
        if not request or not request.user:
            raise serializers.ValidationError('Utilisateur non authentifié.')
        
        user = request.user
        try:
            client = Client.objects.get(user=user)
        except Client.DoesNotExist:
            raise serializers.ValidationError('Profil client introuvable.')

        try:
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
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Erreur lors de la création de la réservation: {e}", exc_info=True)
            raise serializers.ValidationError(f'Erreur lors de la création de la réservation: {str(e)}')
