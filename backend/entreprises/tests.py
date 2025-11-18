from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Entreprise

User = get_user_model()


class EntrepriseModelTest(TestCase):
    """Tests pour le modèle Entreprise"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='entreprise_user',
            email='entreprise@example.com',
            password='testpass123',
            role=User.ROLE_ENTREPRISE
        )
    
    def test_create_entreprise(self):
        """Test de création d'une entreprise"""
        entreprise = Entreprise.objects.create(
            user=self.user,
            nom='Test Entreprise',
            domaine='Mécanique',
            ville='Paris',
            description='Description test',
            adresse='123 Rue Test',
            telephone='0123456789'
        )
        self.assertEqual(entreprise.nom, 'Test Entreprise')
        self.assertEqual(entreprise.domaine, 'Mécanique')
        self.assertEqual(entreprise.ville, 'Paris')
        self.assertFalse(entreprise.est_valide)  # Par défaut non validée


class EntrepriseAPITest(TestCase):
    """Tests pour les endpoints publics des entreprises"""
    
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
            ville='Paris',
            description='Description test',
            est_valide=True
        )
    
    def test_list_entreprises(self):
        """Test de liste des entreprises"""
        response = self.client.get('/api/entreprises/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_list_entreprises_with_domaine_filter(self):
        """Test de filtrage par domaine"""
        response = self.client.get('/api/entreprises/?domaine=Mécanique')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', [])
        if results:
            self.assertEqual(results[0]['domaine'], 'Mécanique')
    
    def test_list_entreprises_with_ville_filter(self):
        """Test de filtrage par ville"""
        response = self.client.get('/api/entreprises/?ville=Paris')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', [])
        if results:
            self.assertEqual(results[0]['ville'], 'Paris')
    
    def test_list_entreprises_with_search(self):
        """Test de recherche globale"""
        response = self.client.get('/api/entreprises/?search=Test')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', [])
        # La recherche devrait trouver l'entreprise
        self.assertGreater(len(results), 0)
    
    def test_get_entreprise_detail(self):
        """Test de récupération des détails d'une entreprise"""
        response = self.client.get(f'/api/entreprises/{self.entreprise.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nom'], 'Test Entreprise')
        self.assertEqual(response.data['domaine'], 'Mécanique')
    
    def test_get_entreprise_services(self):
        """Test de récupération des services d'une entreprise"""
        from services_app.models import Service
        Service.objects.create(
            entreprise=self.entreprise,
            nom='Service Test',
            description='Description service',
            duree_minutes=60,
            prix=50.00
        )
        
        response = self.client.get(f'/api/entreprises/{self.entreprise.id}/services/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data if isinstance(response.data, list) else [])
        self.assertGreater(len(results), 0)


class EntreprisePrivateAPITest(TestCase):
    """Tests pour les endpoints privés des entreprises"""
    
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
    
    def test_get_mon_profil(self):
        """Test de récupération du profil entreprise"""
        response = self.client.get('/api/entreprise/mon-profil/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nom'], 'Test Entreprise')
    
    def test_update_mon_profil(self):
        """Test de mise à jour du profil entreprise"""
        data = {
            'nom': 'Entreprise Modifiée',
            'description': 'Nouvelle description',
            'domaine': 'Coiffure',
            'ville': 'Lyon',
            'adresse': '456 Nouvelle Rue',
            'telephone': '0987654321'
        }
        response = self.client.put('/api/entreprise/mon-profil/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nom'], 'Entreprise Modifiée')
        self.assertEqual(response.data['domaine'], 'Coiffure')
        
        # Vérifier en base
        self.entreprise.refresh_from_db()
        self.assertEqual(self.entreprise.nom, 'Entreprise Modifiée')

