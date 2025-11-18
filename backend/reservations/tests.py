from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, time, timedelta
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from entreprises.models import Entreprise
from clients.models import Client
from services_app.models import Service
from disponibilites.models import Disponibilite
from .models import Reservation

User = get_user_model()


class ReservationModelTest(TestCase):
    """Tests pour le modèle Reservation"""
    
    def setUp(self):
        self.user_entreprise = User.objects.create_user(
            username='entreprise_user',
            email='entreprise@example.com',
            password='testpass123',
            role=User.ROLE_ENTREPRISE
        )
        self.user_client = User.objects.create_user(
            username='client_user',
            email='client@example.com',
            password='testpass123',
            role=User.ROLE_CLIENT
        )
        self.entreprise = Entreprise.objects.create(
            user=self.user_entreprise,
            nom='Test Entreprise',
            domaine='Mécanique',
            ville='Paris',
            est_valide=True
        )
        self.client_profile = Client.objects.create(user=self.user_client)
        self.service = Service.objects.create(
            entreprise=self.entreprise,
            nom='Service Test',
            description='Description',
            duree_minutes=60,
            prix=50.00
        )
        self.disponibilite = Disponibilite.objects.create(
            entreprise=self.entreprise,
            date=date.today() + timedelta(days=1),
            heure_debut=time(9, 0),
            heure_fin=time(17, 0),
            capacite=5
        )
    
    def test_create_reservation(self):
        """Test de création d'une réservation"""
        reservation = Reservation.objects.create(
            entreprise=self.entreprise,
            client=self.client_profile,
            service=self.service,
            date=self.disponibilite.date,
            heure_debut=time(10, 0),
            heure_fin=time(11, 0),
            statut=Reservation.STATUT_EN_ATTENTE
        )
        self.assertEqual(reservation.entreprise, self.entreprise)
        self.assertEqual(reservation.client, self.client_profile)
        self.assertEqual(reservation.statut, Reservation.STATUT_EN_ATTENTE)


class ReservationAPITest(TestCase):
    """Tests pour les endpoints de réservation"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Créer utilisateurs
        self.user_entreprise = User.objects.create_user(
            username='entreprise_user',
            email='entreprise@example.com',
            password='testpass123',
            role=User.ROLE_ENTREPRISE
        )
        self.user_client = User.objects.create_user(
            username='client_user',
            email='client@example.com',
            password='testpass123',
            role=User.ROLE_CLIENT
        )
        
        # Créer profils
        self.entreprise = Entreprise.objects.create(
            user=self.user_entreprise,
            nom='Test Entreprise',
            domaine='Mécanique',
            ville='Paris',
            est_valide=True
        )
        self.client_profile = Client.objects.create(user=self.user_client)
        
        # Créer service et disponibilité
        self.service = Service.objects.create(
            entreprise=self.entreprise,
            nom='Service Test',
            description='Description',
            duree_minutes=60,
            prix=50.00
        )
        tomorrow = date.today() + timedelta(days=1)
        self.disponibilite = Disponibilite.objects.create(
            entreprise=self.entreprise,
            date=tomorrow,
            heure_debut=time(9, 0),
            heure_fin=time(17, 0),
            capacite=5
        )
        
        # Authentifier le client
        refresh = RefreshToken.for_user(self.user_client)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    def test_create_reservation(self):
        """Test de création d'une réservation"""
        data = {
            'entreprise_id': self.entreprise.id,
            'service_id': self.service.id,
            'date': str(self.disponibilite.date),
            'heure_debut': '10:00:00',
            'commentaire_client': 'Test commentaire'
        }
        response = self.client.post('/api/reservations/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['statut'], Reservation.STATUT_EN_ATTENTE)
    
    def test_create_reservation_past_date(self):
        """Test de création d'une réservation avec date passée (doit échouer)"""
        yesterday = date.today() - timedelta(days=1)
        data = {
            'entreprise_id': self.entreprise.id,
            'service_id': self.service.id,
            'date': str(yesterday),
            'heure_debut': '10:00:00'
        }
        response = self.client.post('/api/reservations/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_client_reservations(self):
        """Test de récupération des réservations d'un client"""
        # Créer une réservation
        reservation = Reservation.objects.create(
            entreprise=self.entreprise,
            client=self.client_profile,
            service=self.service,
            date=self.disponibilite.date,
            heure_debut=time(10, 0),
            heure_fin=time(11, 0)
        )
        
        response = self.client.get('/api/client/reservations/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', [])
        self.assertGreater(len(results), 0)
    
    def test_cancel_client_reservation(self):
        """Test d'annulation d'une réservation par le client"""
        tomorrow = date.today() + timedelta(days=1)
        reservation = Reservation.objects.create(
            entreprise=self.entreprise,
            client=self.client_profile,
            service=self.service,
            date=tomorrow,
            heure_debut=time(10, 0),
            heure_fin=time(11, 0),
            statut=Reservation.STATUT_EN_ATTENTE
        )
        
        response = self.client.delete(f'/api/client/reservations/{reservation.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        reservation.refresh_from_db()
        self.assertEqual(reservation.statut, Reservation.STATUT_ANNULE)
    
    def test_get_entreprise_reservations(self):
        """Test de récupération des réservations d'une entreprise"""
        # Authentifier l'entreprise
        refresh = RefreshToken.for_user(self.user_entreprise)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        # Créer une réservation
        reservation = Reservation.objects.create(
            entreprise=self.entreprise,
            client=self.client_profile,
            service=self.service,
            date=self.disponibilite.date,
            heure_debut=time(10, 0),
            heure_fin=time(11, 0)
        )
        
        response = self.client.get('/api/entreprise/reservations/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', [])
        self.assertGreater(len(results), 0)
    
    def test_update_reservation_status(self):
        """Test de mise à jour du statut d'une réservation"""
        # Authentifier l'entreprise
        refresh = RefreshToken.for_user(self.user_entreprise)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        reservation = Reservation.objects.create(
            entreprise=self.entreprise,
            client=self.client_profile,
            service=self.service,
            date=self.disponibilite.date,
            heure_debut=time(10, 0),
            heure_fin=time(11, 0),
            statut=Reservation.STATUT_EN_ATTENTE
        )
        
        data = {
            'statut': Reservation.STATUT_CONFIRME,
            'commentaire_entreprise': 'Réservation confirmée'
        }
        response = self.client.patch(f'/api/entreprise/reservations/{reservation.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['statut'], Reservation.STATUT_CONFIRME)
        
        reservation.refresh_from_db()
        self.assertEqual(reservation.statut, Reservation.STATUT_CONFIRME)

