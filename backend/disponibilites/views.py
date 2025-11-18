from rest_framework import generics, permissions
from accounts.permissions import IsEntreprise
from entreprises.models import Entreprise
from .models import Disponibilite
from .serializers import DisponibiliteSerializer


class EntrepriseDisponibiliteListCreateView(generics.ListCreateAPIView):
    serializer_class = DisponibiliteSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_queryset(self):
        try:
            entreprise = Entreprise.objects.get(user=self.request.user)
            return Disponibilite.objects.filter(entreprise=entreprise).order_by('date', 'heure_debut')
        except Entreprise.DoesNotExist:
            return Disponibilite.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        try:
            entreprise = Entreprise.objects.get(user=self.request.user)
            serializer.save(entreprise=entreprise)
        except Entreprise.DoesNotExist:
            from rest_framework import serializers as drf_serializers
            raise drf_serializers.ValidationError('Profil entreprise introuvable.')


class EntrepriseDisponibiliteUpdateView(generics.UpdateAPIView):
    """
    PUT /api/entreprise/disponibilites/<id>/ - Mettre à jour une disponibilité
    PATCH /api/entreprise/disponibilites/<id>/ - Mettre à jour partiellement une disponibilité
    """
    serializer_class = DisponibiliteSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        try:
            entreprise = Entreprise.objects.get(user=self.request.user)
            return Disponibilite.objects.filter(entreprise=entreprise)
        except Entreprise.DoesNotExist:
            return Disponibilite.objects.none()


class EntrepriseDisponibiliteDeleteView(generics.DestroyAPIView):
    serializer_class = DisponibiliteSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_queryset(self):
        try:
            entreprise = Entreprise.objects.get(user=self.request.user)
            return Disponibilite.objects.filter(entreprise=entreprise)
        except Entreprise.DoesNotExist:
            return Disponibilite.objects.none()
