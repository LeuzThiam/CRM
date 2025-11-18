from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserModelTest(TestCase):
    """Tests pour le modèle User"""
    
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'role': User.ROLE_CLIENT
        }
    
    def test_create_user(self):
        """Test de création d'un utilisateur"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.role, User.ROLE_CLIENT)
        self.assertTrue(user.check_password('testpass123'))
    
    def test_create_entreprise_user(self):
        """Test de création d'un utilisateur entreprise"""
        data = self.user_data.copy()
        data['role'] = User.ROLE_ENTREPRISE
        user = User.objects.create_user(**data)
        self.assertEqual(user.role, User.ROLE_ENTREPRISE)


class AuthenticationAPITest(TestCase):
    """Tests pour les endpoints d'authentification"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role=User.ROLE_CLIENT
        )
    
    def test_register_client(self):
        """Test d'inscription d'un client"""
        data = {
            'username': 'newclient',
            'email': 'client@example.com',
            'password': 'password123',
            'role': 'client'
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['role'], 'client')
    
    def test_register_entreprise(self):
        """Test d'inscription d'une entreprise"""
        data = {
            'username': 'newentreprise',
            'email': 'entreprise@example.com',
            'password': 'password123',
            'role': 'entreprise',
            'nom_entreprise': 'Mon Entreprise',
            'domaine_entreprise': 'Mécanique',
            'ville_entreprise': 'Paris'
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['role'], 'entreprise')
        
        # Vérifier que le profil entreprise a été créé
        from entreprises.models import Entreprise
        entreprise = Entreprise.objects.get(user__username='newentreprise')
        self.assertEqual(entreprise.nom, 'Mon Entreprise')
        self.assertEqual(entreprise.domaine, 'Mécanique')
        self.assertEqual(entreprise.ville, 'Paris')
    
    def test_login_with_email(self):
        """Test de connexion avec email"""
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post('/api/auth/login/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_login_with_username(self):
        """Test de connexion avec username"""
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post('/api/auth/login/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_get_me_authenticated(self):
        """Test de récupération du profil utilisateur authentifié"""
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
    
    def test_get_me_unauthenticated(self):
        """Test de récupération du profil sans authentification"""
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

