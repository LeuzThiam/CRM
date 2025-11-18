from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework import serializers as drf_serializers
from accounts.permissions import IsEntreprise
from entreprises.models import Entreprise
from .models import Service
from .serializers import ServiceSerializer


class EntrepriseServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_queryset(self):
        try:
            entreprise = Entreprise.objects.get(user=self.request.user)
            return Service.objects.filter(entreprise=entreprise)
        except Entreprise.DoesNotExist:
            return Service.objects.none()

    def perform_create(self, serializer):
        try:
            entreprise = Entreprise.objects.get(user=self.request.user)
            serializer.save(entreprise=entreprise)
        except Entreprise.DoesNotExist:
            raise drf_serializers.ValidationError('Profil entreprise introuvable.')


class EntrepriseServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_queryset(self):
        try:
            entreprise = Entreprise.objects.get(user=self.request.user)
            return Service.objects.filter(entreprise=entreprise)
        except Entreprise.DoesNotExist:
            return Service.objects.none()
