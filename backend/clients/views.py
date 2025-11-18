from rest_framework import generics, permissions
from accounts.permissions import IsClient
from .models import Client
from .serializers import ClientSerializer, ClientProfileSerializer


class ClientProfileView(generics.RetrieveUpdateAPIView):
    """
    GET /api/client/mon-profil/ - Voir le profil client
    PUT /api/client/mon-profil/ - Mettre à jour le profil client
    """
    serializer_class = ClientProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsClient]

    def get_object(self):
        try:
            return Client.objects.get(user=self.request.user)
        except Client.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound('Profil client introuvable.')
