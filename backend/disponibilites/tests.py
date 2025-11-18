from django.test import TestCase
from django.contrib.auth import get_user_model
from datetime import date, time, timedelta
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from entreprises.models import Entreprise
from .models import Disponibilite

User = get_user_model()


class DisponibiliteModelTest(TestCase):
    """Tests pour le modèle Disponibilite"""
    
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
    
    def test_create_disponibilite(self):
        """Test de création d'une disponibilité"""
        tomorrow = date.today() + timedelta(days=1)
        disponibilite = Disponibilite.objects.create(
            entreprise=self.entreprise,
            date=tomorrow,
            heure_debut=time(9, 0),
            heure_fin=time(17, 0),
            capacite=5
        )
        self.assertEqual(disponibilite.entreprise, self.entreprise)
        self.assertEqual(disponibilite.date, tomorrow)
        self.assertEqual(disponibilite.capacite, 5)


class DisponibiliteAPITest(TestCase):
    """Tests pour les endpoints de disponibilités"""
    
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
    
    def test_create_disponibilite(self):
        """Test de création d'une disponibilité"""
        tomorrow = date.today() + timedelta(days=1)
        data = {
            'date': str(tomorrow),
            'heure_debut': '09:00:00',
            'heure_fin': '17:00:00',
            'capacite': 5
        }
        response = self.client.post('/api/entreprise/disponibilites/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['capacite'], 5)
    
    def test_create_disponibilite_past_date(self):
        """Test de création d'une disponibilité avec date passée (doit échouer)"""
        yesterday = date.today() - timedelta(days=1)
        data = {
            'date': str(yesterday),
            'heure_debut': '09:00:00',
            'heure_fin': '17:00:00',
            'capacite': 5
        }
        response = self.client.post('/api/entreprise/disponibilites/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_create_disponibilite_invalid_time(self):
        """Test de création d'une disponibilité avec heure_fin <= heure_debut (doit échouer)"""
        tomorrow = date.today() + timedelta(days=1)
        data = {
            'date': str(tomorrow),
            'heure_debut': '17:00:00',
            'heure_fin': '09:00:00',  # Heure de fin avant heure de début
            'capacite': 5
        }
        response = self.client.post('/api/entreprise/disponibilites/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_list_disponibilites(self):
        """Test de liste des disponibilités"""
        tomorrow = date.today() + timedelta(days=1)
        Disponibilite.objects.create(
            entreprise=self.entreprise,
            date=tomorrow,
            heure_debut=time(9, 0),
            heure_fin=time(12, 0),
            capacite=3
        )
        Disponibilite.objects.create(
            entreprise=self.entreprise,
            date=tomorrow,
            heure_debut=time(14, 0),
            heure_fin=time(17, 0),
            capacite=2
        )
        
        response = self.client.get('/api/entreprise/disponibilites/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', [])
        self.assertEqual(len(results), 2)
    
    def test_update_disponibilite(self):
        """Test de mise à jour d'une disponibilité"""
        tomorrow = date.today() + timedelta(days=1)
        disponibilite = Disponibilite.objects.create(
            entreprise=self.entreprise,
            date=tomorrow,
            heure_debut=time(9, 0),
            heure_fin=time(12, 0),
            capacite=3
        )
        
        data = {
            'date': str(tomorrow),
            'heure_debut': '10:00:00',
            'heure_fin': '13:00:00',
            'capacite': 5
        }
        response = self.client.put(f'/api/entreprise/disponibilites/{disponibilite.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['capacite'], 5)
    
    def test_delete_disponibilite(self):
        """Test de suppression d'une disponibilité"""
        tomorrow = date.today() + timedelta(days=1)
        disponibilite = Disponibilite.objects.create(
            entreprise=self.entreprise,
            date=tomorrow,
            heure_debut=time(9, 0),
            heure_fin=time(12, 0),
            capacite=3
        )
        
        response = self.client.delete(f'/api/entreprise/disponibilites/{disponibilite.id}/delete/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Vérifier que la disponibilité n'existe plus
        self.assertFalse(Disponibilite.objects.filter(id=disponibilite.id).exists())

