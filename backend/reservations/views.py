from rest_framework import generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.permissions import IsClient, IsEntreprise
from .models import Reservation
from .serializers import ReservationSerializer, ReservationCreateSerializer


class ClientReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated, IsClient]

    def get_queryset(self):
        return Reservation.objects.filter(
            client__user=self.request.user
        ).select_related(
            'entreprise', 'client', 'service', 'client__user'
        ).order_by('-date_creation')


class ClientReservationDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/client/reservations/<id>/ - Annuler une réservation (client)
    """
    permission_classes = [permissions.IsAuthenticated, IsClient]

    def get_queryset(self):
        return Reservation.objects.filter(
            client__user=self.request.user,
            statut__in=[Reservation.STATUT_EN_ATTENTE, Reservation.STATUT_CONFIRME]
        )

    def perform_destroy(self, instance):
        # Vérifier que la réservation peut être annulée (pas dans le passé)
        from datetime import date, datetime, time
        today = date.today()
        now = datetime.now().time()
        
        if instance.date < today or (instance.date == today and instance.heure_debut < now):
            from rest_framework.exceptions import ValidationError
            raise ValidationError('Impossible d\'annuler une réservation passée.')
        
        instance.statut = Reservation.STATUT_ANNULE
        instance.save()


class ReservationCreateView(generics.CreateAPIView):
    serializer_class = ReservationCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsClient]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class EntrepriseReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_queryset(self):
        try:
            from entreprises.models import Entreprise
            entreprise = Entreprise.objects.get(user=self.request.user)
            return Reservation.objects.filter(
                entreprise=entreprise
            ).select_related(
                'entreprise', 'client', 'service', 'client__user'
            ).order_by('-date_creation')
        except Entreprise.DoesNotExist:
            return Reservation.objects.none()


class EntrepriseReservationUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]
    http_method_names = ['patch', 'options', 'head']

    def get_queryset(self):
        try:
            from entreprises.models import Entreprise
            entreprise = Entreprise.objects.get(user=self.request.user)
            return Reservation.objects.filter(entreprise=entreprise)
        except Entreprise.DoesNotExist:
            return Reservation.objects.none()
    
    def get_serializer_class(self):
        # Permettre la mise à jour partielle du statut et commentaire_entreprise
        from rest_framework import serializers
        from .models import Reservation
        
        class ReservationUpdateSerializer(serializers.ModelSerializer):
            class Meta:
                model = Reservation
                fields = ['statut', 'commentaire_entreprise']
        
        return ReservationUpdateSerializer


class EntrepriseReservationDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/entreprise/reservations/<id>/ - Annuler une réservation (entreprise)
    """
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_queryset(self):
        try:
            from entreprises.models import Entreprise
            entreprise = Entreprise.objects.get(user=self.request.user)
            return Reservation.objects.filter(
                entreprise=entreprise,
                statut__in=[Reservation.STATUT_EN_ATTENTE, Reservation.STATUT_CONFIRME]
            )
        except Entreprise.DoesNotExist:
            return Reservation.objects.none()

    def perform_destroy(self, instance):
        instance.statut = Reservation.STATUT_ANNULE
        instance.save()
