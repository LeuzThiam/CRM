from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Client

User = get_user_model()


class ClientModelTest(TestCase):
    """Tests pour le modèle Client"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='client_user',
            email='client@example.com',
            password='testpass123',
            role=User.ROLE_CLIENT
        )
    
    def test_create_client(self):
        """Test de création d'un client"""
        client = Client.objects.create(
            user=self.user,
            telephone='0123456789'
        )
        self.assertEqual(client.user, self.user)
        self.assertEqual(client.telephone, '0123456789')


class ClientAPITest(TestCase):
    """Tests pour les endpoints clients"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='client_user',
            email='client@example.com',
            password='testpass123',
            role=User.ROLE_CLIENT
        )
        self.client_profile = Client.objects.create(
            user=self.user,
            telephone='0123456789'
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    def test_get_client_profile(self):
        """Test de récupération du profil client"""
        response = self.client.get('/api/client/mon-profil/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'client_user')
        self.assertEqual(response.data['telephone'], '0123456789')
    
    def test_update_client_profile(self):
        """Test de mise à jour du profil client"""
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'telephone': '0987654321'
        }
        response = self.client.put('/api/client/mon-profil/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['telephone'], '0987654321')
        
        # Vérifier en base
        self.client_profile.refresh_from_db()
        self.assertEqual(self.client_profile.telephone, '0987654321')
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'John')
        self.assertEqual(self.user.last_name, 'Doe')

