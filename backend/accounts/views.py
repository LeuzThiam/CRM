from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user_data = UserSerializer(request.user).data
            profile_data = None

            if request.user.role == User.ROLE_CLIENT:
                try:
                    from clients.models import Client
                    profile = Client.objects.get(user=request.user)
                    profile_data = {
                        'id': profile.id,
                        'telephone': profile.telephone,
                        'date_creation': profile.date_creation,
                    }
                except Client.DoesNotExist:
                    profile_data = None
                except Exception as e:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Erreur lors de la récupération du profil client: {e}")
                    profile_data = None
            elif request.user.role == User.ROLE_ENTREPRISE:
                try:
                    from entreprises.models import Entreprise
                    profile = Entreprise.objects.get(user=request.user)
                    profile_data = {
                        'id': profile.id,
                        'nom': profile.nom,
                        'description': profile.description,
                        'domaine': profile.domaine,
                        'adresse': profile.adresse,
                        'ville': profile.ville,
                        'telephone': profile.telephone,
                        'est_valide': profile.est_valide,
                        'date_creation': profile.date_creation,
                    }
                except Entreprise.DoesNotExist:
                    profile_data = None
                except Exception as e:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Erreur lors de la récupération du profil entreprise: {e}")
                    profile_data = None

            return Response({'user': user_data, 'profile': profile_data})
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Erreur dans MeView: {e}", exc_info=True)
            from rest_framework import status
            return Response(
                {'error': 'Une erreur est survenue lors de la récupération des données.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
