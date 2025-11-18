from rest_framework import generics, permissions
from .models import Entreprise
from .serializers import (
    EntreprisePublicSerializer,
    EntrepriseProfileSerializer,
)
from accounts.permissions import IsEntreprise
from services_app.models import Service
from services_app.serializers import ServiceSerializer
from disponibilites.models import Disponibilite
from disponibilites.serializers import DisponibiliteSerializer


class EntrepriseListView(generics.ListAPIView):
    serializer_class = EntreprisePublicSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Entreprise.objects.filter(est_valide=True)
        domaine = self.request.query_params.get('domaine')
        ville = self.request.query_params.get('ville')
        if domaine:
            qs = qs.filter(domaine__icontains=domaine)
        if ville:
            qs = qs.filter(ville__icontains=ville)
        return qs


class EntrepriseDetailView(generics.RetrieveAPIView):
    queryset = Entreprise.objects.filter(est_valide=True)
    serializer_class = EntreprisePublicSerializer
    permission_classes = [permissions.AllowAny]


class EntrepriseServicesPublicView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        entreprise_id = self.kwargs.get('pk')
        return Service.objects.filter(entreprise_id=entreprise_id, est_actif=True)


class EntrepriseDisponibilitesPublicView(generics.ListAPIView):
    serializer_class = DisponibiliteSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        entreprise_id = self.kwargs.get('pk')
        qs = Disponibilite.objects.filter(entreprise_id=entreprise_id)
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(date=date)
        return qs


class MonProfilView(generics.RetrieveUpdateAPIView):
    serializer_class = EntrepriseProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_object(self):
        return Entreprise.objects.get(user=self.request.user)
