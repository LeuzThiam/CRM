from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from entreprises.models import Entreprise
from .models import Service

User = get_user_model()


class ServiceModelTest(TestCase):
    """Tests pour le modèle Service"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='entreprise_user',
            email='entreprise@example.com',
            password='testpass123',
            role=User.ROLE_ENTREPRISE
        )
        self.entreprise = Entreprise.objects.create(
            user=self.user,
            nom='Test Entreprise',
            domaine='Mécanique',
            ville='Paris'
        )
    
    def test_create_service(self):
        """Test de création d'un service"""
        service = Service.objects.create(
            entreprise=self.entreprise,
            nom='Service Test',
            description='Description du service',
            duree_minutes=60,
            prix=50.00
        )
        self.assertEqual(service.nom, 'Service Test')
        self.assertEqual(service.duree_minutes, 60)
        self.assertEqual(service.prix, 50.00)
        self.assertTrue(service.est_actif)  # Par défaut actif


class ServiceAPITest(TestCase):
    """Tests pour les endpoints de services"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='entreprise_user',
            email='entreprise@example.com',
            password='testpass123',
            role=User.ROLE_ENTREPRISE
        )
        self.entreprise = Entreprise.objects.create(
            user=self.user,
            nom='Test Entreprise',
            domaine='Mécanique',
            ville='Paris'
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    def test_create_service(self):
        """Test de création d'un service"""
        data = {
            'nom': 'Nouveau Service',
            'description': 'Description du nouveau service',
            'duree_minutes': 90,
            'prix': '75.00'
        }
        response = self.client.post('/api/entreprise/services/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nom'], 'Nouveau Service')
        self.assertEqual(response.data['duree_minutes'], 90)
    
    def test_list_services(self):
        """Test de liste des services"""
        Service.objects.create(
            entreprise=self.entreprise,
            nom='Service 1',
            duree_minutes=60,
            prix=50.00
        )
        Service.objects.create(
            entreprise=self.entreprise,
            nom='Service 2',
            duree_minutes=30,
            prix=25.00
        )
        
        response = self.client.get('/api/entreprise/services/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', [])
        self.assertEqual(len(results), 2)
    
    def test_update_service(self):
        """Test de mise à jour d'un service"""
        service = Service.objects.create(
            entreprise=self.entreprise,
            nom='Service Original',
            duree_minutes=60,
            prix=50.00
        )
        
        data = {
            'nom': 'Service Modifié',
            'description': 'Nouvelle description',
            'duree_minutes': 90,
            'prix': '75.00'
        }
        response = self.client.put(f'/api/entreprise/services/{service.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nom'], 'Service Modifié')
        self.assertEqual(response.data['duree_minutes'], 90)
    
    def test_delete_service(self):
        """Test de suppression d'un service"""
        service = Service.objects.create(
            entreprise=self.entreprise,
            nom='Service à supprimer',
            duree_minutes=60,
            prix=50.00
        )
        
        response = self.client.delete(f'/api/entreprise/services/{service.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Vérifier que le service n'existe plus
        self.assertFalse(Service.objects.filter(id=service.id).exists())

