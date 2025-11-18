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
        qs = Entreprise.objects.filter(est_valide=True).select_related('user')
        
        # Recherche par nom d'entreprise
        nom = self.request.query_params.get('nom')
        if nom:
            qs = qs.filter(nom__icontains=nom)
        
        # Recherche par domaine
        domaine = self.request.query_params.get('domaine')
        if domaine:
            qs = qs.filter(domaine__icontains=domaine)
        
        # Recherche par ville
        ville = self.request.query_params.get('ville')
        if ville:
            qs = qs.filter(ville__icontains=ville)
        
        # Recherche globale (nom, domaine ou description)
        search = self.request.query_params.get('search')
        if search:
            from django.db.models import Q
            qs = qs.filter(
                Q(nom__icontains=search) |
                Q(domaine__icontains=search) |
                Q(description__icontains=search) |
                Q(ville__icontains=search)
            )
        
        return qs.order_by('nom')


class EntrepriseDetailView(generics.RetrieveAPIView):
    serializer_class = EntreprisePublicSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Entreprise.objects.filter(est_valide=True)


class EntrepriseServicesPublicView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        entreprise_id = self.kwargs.get('id')
        return Service.objects.filter(entreprise_id=entreprise_id, est_actif=True)


class EntrepriseDisponibilitesPublicView(generics.ListAPIView):
    serializer_class = DisponibiliteSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        entreprise_id = self.kwargs.get('id')
        qs = Disponibilite.objects.filter(entreprise_id=entreprise_id)
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(date=date)
        return qs


class MonProfilView(generics.RetrieveUpdateAPIView):
    serializer_class = EntrepriseProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsEntreprise]

    def get_object(self):
        try:
            return Entreprise.objects.get(user=self.request.user)
        except Entreprise.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound('Profil entreprise introuvable.')
