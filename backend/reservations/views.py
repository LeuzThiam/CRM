from rest_framework import generics, permissions
from accounts.permissions import IsClient, IsEntreprise
from .models import Reservation
from .serializers import ReservationSerializer, ReservationCreateSerializer


class ClientReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated, IsClient]

    def get_queryset(self):
        return Reservation.objects.filter(client__user=self.request.user).order_by('-date_creation')


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
        return Reservation.objects.filter(entreprise__user=self.request.user).order_by('-date_creation')


class EntrepriseReservationUpdateView(generics.UpdateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]
    http_method_names = ['patch', 'options', 'head']

    def get_queryset(self):
        return Reservation.objects.filter(entreprise__user=self.request.user)
