# Vue d'ensemble des Tests

## 📋 Résumé

Ce projet contient une suite complète de tests pour le backend Django, couvrant :
- ✅ Authentification (inscription, connexion, profil)
- ✅ Gestion des entreprises (CRUD, recherche, filtres)
- ✅ Gestion des clients (profil)
- ✅ Services (CRUD)
- ✅ Disponibilités (CRUD, validation)
- ✅ Réservations (création, annulation, statuts)
- ✅ Tests d'intégration (flux complets)

## 📁 Structure

```
backend/
├── accounts/
│   └── tests.py              # Tests d'authentification
├── entreprises/
│   └── tests.py              # Tests des entreprises
├── clients/
│   └── tests.py              # Tests des clients
├── services_app/
│   └── tests.py              # Tests des services
├── disponibilites/
│   └── tests.py              # Tests des disponibilités
├── reservations/
│   └── tests.py              # Tests des réservations
├── tests/
│   ├── __init__.py
│   └── test_integration.py   # Tests d'intégration
├── pytest.ini                # Configuration pytest (optionnel)
└── README_TESTS.md           # Guide détaillé
```

## 🚀 Exécution Rapide

### Tous les tests
```bash
cd backend
python manage.py test
```

### Par application
```bash
python manage.py test accounts
python manage.py test entreprises
python manage.py test reservations
```

### Tests spécifiques
```bash
python manage.py test accounts.tests.AuthenticationAPITest.test_register_client
```

### Avec verbosité
```bash
python manage.py test --verbosity=2
```

## 📊 Statistiques

- **Total de tests** : ~40+ tests
- **Applications couvertes** : 6
- **Types de tests** :
  - Tests unitaires (modèles, serializers)
  - Tests d'API (endpoints REST)
  - Tests d'intégration (flux complets)

## ✅ Tests Inclus

### Accounts (8 tests)
- Création d'utilisateur
- Inscription client
- Inscription entreprise avec données complètes
- Connexion avec email
- Connexion avec username
- Récupération du profil (authentifié)
- Récupération du profil (non authentifié)

### Entreprises (10+ tests)
- Création d'entreprise
- Liste des entreprises
- Filtrage par domaine
- Filtrage par ville
- Recherche globale
- Détails d'une entreprise
- Services d'une entreprise
- Gestion du profil entreprise (GET/PUT)

### Clients (3 tests)
- Création de client
- Récupération du profil
- Mise à jour du profil

### Services (5 tests)
- Création de service
- Liste des services
- Mise à jour de service
- Suppression de service

### Disponibilités (6 tests)
- Création de disponibilité
- Validation date passée
- Validation heure invalide
- Liste des disponibilités
- Mise à jour de disponibilité
- Suppression de disponibilité

### Réservations (8+ tests)
- Création de réservation
- Validation date passée
- Récupération réservations client
- Annulation par client
- Récupération réservations entreprise
- Mise à jour statut réservation

### Intégration (1 test)
- Flux complet : Inscription → Service → Disponibilité → Réservation → Confirmation

## 🔧 Configuration

### Base de données de test
Les tests utilisent une base de données SQLite en mémoire, créée automatiquement et détruite après chaque exécution.

### Authentification
Les tests utilisent JWT avec `RefreshToken` pour authentifier les requêtes API.

### Fixtures
Les données de test sont créées dans `setUp()` de chaque classe de test.

## 📝 Ajout de Nouveaux Tests

1. Créez une classe héritant de `TestCase`
2. Définissez `setUp()` pour préparer les données
3. Créez des méthodes `test_*` pour chaque cas
4. Utilisez `APIClient` pour les requêtes HTTP
5. Utilisez `RefreshToken` pour l'authentification

Exemple :
```python
class MyTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(...)
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    def test_my_endpoint(self):
        response = self.client.get('/api/my-endpoint/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
```

## 🎯 Couverture

Pour vérifier la couverture de code :
```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Génère htmlcov/index.html
```

## 📚 Documentation

- `README_TESTS.md` : Guide détaillé avec exemples
- Ce fichier : Vue d'ensemble rapide

## ⚠️ Notes

- Les tests sont isolés (transaction rollback après chaque test)
- Les migrations sont appliquées automatiquement
- Les tests peuvent être exécutés en parallèle avec `--parallel`

