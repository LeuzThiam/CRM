"""
Tests d'intégration pour vérifier le flux complet de l'application
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date, time, timedelta
from entreprises.models import Entreprise
from clients.models import Client
from services_app.models import Service
from disponibilites.models import Disponibilite
from reservations.models import Reservation

User = get_user_model()


class CompleteFlowTest(TestCase):
    """Tests d'intégration pour le flux complet"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_complete_reservation_flow(self):
        """Test du flux complet : Inscription entreprise -> Création service -> 
        Création disponibilité -> Inscription client -> Réservation"""
        
        # 1. Inscription entreprise
        data_entreprise = {
            'username': 'entreprise_test',
            'email': 'entreprise@test.com',
            'password': 'password123',
            'role': 'entreprise',
            'nom_entreprise': 'Mon Garage',
            'domaine_entreprise': 'Mécanique',
            'ville_entreprise': 'Paris',
            'description_entreprise': 'Garage automobile',
            'adresse_entreprise': '123 Rue Test',
            'telephone_entreprise': '0123456789'
        }
        response = self.client.post('/api/auth/register/', data_entreprise)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        entreprise_user_id = response.data['id']
        
        # Vérifier que l'entreprise a été créée
        entreprise = Entreprise.objects.get(user_id=entreprise_user_id)
        self.assertEqual(entreprise.nom, 'Mon Garage')
        self.assertEqual(entreprise.domaine, 'Mécanique')
        
        # Valider l'entreprise pour qu'elle soit visible
        entreprise.est_valide = True
        entreprise.save()
        
        # 2. Authentifier l'entreprise et créer un service
        entreprise_user = User.objects.get(id=entreprise_user_id)
        refresh = RefreshToken.for_user(entreprise_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        data_service = {
            'nom': 'Révision complète',
            'description': 'Révision complète du véhicule',
            'duree_minutes': 120,
            'prix': '150.00'
        }
        response = self.client.post('/api/entreprise/services/', data_service)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        service_id = response.data['id']
        
        # 3. Créer une disponibilité
        tomorrow = date.today() + timedelta(days=1)
        data_dispo = {
            'date': str(tomorrow),
            'heure_debut': '09:00:00',
            'heure_fin': '17:00:00',
            'capacite': 3
        }
        response = self.client.post('/api/entreprise/disponibilites/', data_dispo)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 4. Inscription client
        self.client.credentials()  # Déconnecter
        data_client = {
            'username': 'client_test',
            'email': 'client@test.com',
            'password': 'password123',
            'role': 'client'
        }
        response = self.client.post('/api/auth/register/', data_client)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        client_user_id = response.data['id']
        
        # 5. Authentifier le client et créer une réservation
        client_user = User.objects.get(id=client_user_id)
        refresh = RefreshToken.for_user(client_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        data_reservation = {
            'entreprise_id': entreprise.id,
            'service_id': service_id,
            'date': str(tomorrow),
            'heure_debut': '10:00:00',
            'commentaire_client': 'Besoin urgent'
        }
        response = self.client.post('/api/reservations/', data_reservation)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        reservation_id = response.data['id']
        
        # 6. Vérifier que la réservation existe
        reservation = Reservation.objects.get(id=reservation_id)
        self.assertEqual(reservation.entreprise, entreprise)
        self.assertEqual(reservation.statut, Reservation.STATUT_EN_ATTENTE)
        
        # 7. L'entreprise confirme la réservation
        self.client.credentials()  # Déconnecter
        refresh = RefreshToken.for_user(entreprise_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        data_update = {
            'statut': Reservation.STATUT_CONFIRME,
            'commentaire_entreprise': 'Réservation confirmée'
        }
        response = self.client.patch(f'/api/entreprise/reservations/{reservation_id}/', data_update)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        reservation.refresh_from_db()
        self.assertEqual(reservation.statut, Reservation.STATUT_CONFIRME)

