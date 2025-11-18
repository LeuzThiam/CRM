# Guide des Tests

Ce document explique comment exécuter les tests pour le backend Django.

## Structure des Tests

Les tests sont organisés par application Django :

- `accounts/tests.py` - Tests d'authentification et d'inscription
- `entreprises/tests.py` - Tests des entreprises (modèles et API)
- `clients/tests.py` - Tests des clients
- `services_app/tests.py` - Tests des services
- `disponibilites/tests.py` - Tests des disponibilités
- `reservations/tests.py` - Tests des réservations
- `tests/test_integration.py` - Tests d'intégration (flux complets)

## Exécution des Tests

### Tous les tests

```bash
cd backend
python manage.py test
```

### Tests d'une application spécifique

```bash
python manage.py test accounts
python manage.py test entreprises
python manage.py test reservations
```

### Tests d'un fichier spécifique

```bash
python manage.py test accounts.tests
python manage.py test entreprises.tests.EntrepriseAPITest
```

### Tests d'une méthode spécifique

```bash
python manage.py test accounts.tests.AuthenticationAPITest.test_register_client
```

### Avec verbosité

```bash
python manage.py test --verbosity=2
```

## Utilisation de pytest (optionnel)

Si vous préférez utiliser pytest :

```bash
pip install pytest pytest-django
cd backend
pytest
```

## Types de Tests

### Tests Unitaires

- **Modèles** : Vérification de la création, validation, méthodes des modèles
- **Serializers** : Validation des données, transformation
- **Permissions** : Vérification des permissions d'accès

### Tests d'API

- **Endpoints** : Test des requêtes HTTP (GET, POST, PUT, DELETE, PATCH)
- **Authentification** : Test avec et sans authentification
- **Validation** : Test des erreurs de validation
- **Permissions** : Test des restrictions d'accès

### Tests d'Intégration

- **Flux complets** : Test de scénarios complets (inscription → création → réservation)
- **Interactions** : Test des interactions entre différents composants

## Exemples de Tests Inclus

### Authentification
- Inscription client
- Inscription entreprise avec données complètes
- Connexion avec email ou username
- Récupération du profil utilisateur

### Entreprises
- Liste des entreprises (avec pagination)
- Filtrage par domaine et ville
- Recherche globale
- Détails d'une entreprise
- Gestion du profil entreprise

### Réservations
- Création d'une réservation
- Validation des dates (pas de réservation dans le passé)
- Validation des conflits
- Annulation par client et entreprise
- Mise à jour du statut

### Services
- CRUD complet des services
- Liste des services d'une entreprise

### Disponibilités
- CRUD complet des disponibilités
- Validation des chevauchements
- Validation des dates passées

## Couverture de Code

Pour vérifier la couverture de code :

```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Génère un rapport HTML dans htmlcov/
```

## Bonnes Pratiques

1. **Nommage** : Utilisez des noms descriptifs (`test_create_reservation_with_valid_data`)
2. **Isolation** : Chaque test doit être indépendant
3. **Setup/Teardown** : Utilisez `setUp()` pour préparer les données
4. **Assertions** : Utilisez des assertions claires
5. **Données de test** : Utilisez des données réalistes mais simples

## Ajout de Nouveaux Tests

Pour ajouter de nouveaux tests :

1. Créez une classe de test héritant de `TestCase`
2. Définissez `setUp()` pour préparer les données
3. Créez des méthodes `test_*` pour chaque cas de test
4. Utilisez `APIClient` pour tester les endpoints
5. Utilisez `RefreshToken` pour l'authentification JWT

Exemple :

```python
class MyAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(...)
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    def test_my_endpoint(self):
        response = self.client.get('/api/my-endpoint/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
```

## Notes

- Les tests utilisent une base de données séparée (en mémoire par défaut)
- Les migrations sont appliquées automatiquement
- Les fixtures peuvent être utilisées pour des données de test complexes
- Les tests sont exécutés dans une transaction qui est rollback après chaque test

