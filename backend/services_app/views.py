from rest_framework import generics, permissions
from accounts.permissions import IsEntreprise
from .models import Service
from .serializers import ServiceSerializer


class EntrepriseServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_queryset(self):
        return Service.objects.filter(entreprise__user=self.request.user)

    def perform_create(self, serializer):
        entreprise = self.request.user.entreprise_profile
        serializer.save(entreprise=entreprise)


class EntrepriseServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_queryset(self):
        return Service.objects.filter(entreprise__user=self.request.user)
