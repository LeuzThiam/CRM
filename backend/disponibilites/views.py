from rest_framework import generics, permissions
from accounts.permissions import IsEntreprise
from .models import Disponibilite
from .serializers import DisponibiliteSerializer


class EntrepriseDisponibiliteListCreateView(generics.ListCreateAPIView):
    serializer_class = DisponibiliteSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_queryset(self):
        return Disponibilite.objects.filter(entreprise__user=self.request.user).order_by('date', 'heure_debut')

    def perform_create(self, serializer):
        entreprise = self.request.user.entreprise_profile
        serializer.save(entreprise=entreprise)


class EntrepriseDisponibiliteDeleteView(generics.DestroyAPIView):
    serializer_class = DisponibiliteSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_queryset(self):
        return Disponibilite.objects.filter(entreprise__user=self.request.user)
