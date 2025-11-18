from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    # Champs optionnels pour l'entreprise (ne sont pas des champs du modèle User)
    # On les définit comme SerializerMethodField ou on les ignore dans to_internal_value
    nom_entreprise = serializers.CharField(required=False, allow_blank=True, max_length=255, write_only=True)
    description_entreprise = serializers.CharField(required=False, allow_blank=True, write_only=True)
    domaine_entreprise = serializers.CharField(required=False, allow_blank=True, max_length=100, write_only=True)
    adresse_entreprise = serializers.CharField(required=False, allow_blank=True, max_length=255, write_only=True)
    ville_entreprise = serializers.CharField(required=False, allow_blank=True, max_length=100, write_only=True)
    telephone_entreprise = serializers.CharField(required=False, allow_blank=True, max_length=50, write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'role',
            'nom_entreprise', 'description_entreprise', 'domaine_entreprise',
            'adresse_entreprise', 'ville_entreprise', 'telephone_entreprise'
        ]

    def to_internal_value(self, data):
        # Extraire les champs entreprise avant la validation
        self.entreprise_fields = {
            'nom_entreprise': data.get('nom_entreprise', ''),
            'description_entreprise': data.get('description_entreprise', ''),
            'domaine_entreprise': data.get('domaine_entreprise', ''),
            'adresse_entreprise': data.get('adresse_entreprise', ''),
            'ville_entreprise': data.get('ville_entreprise', ''),
            'telephone_entreprise': data.get('telephone_entreprise', ''),
        }
        # Créer une copie sans les champs entreprise pour la validation
        data_copy = {k: v for k, v in data.items() if not k.endswith('_entreprise')}
        return super().to_internal_value(data_copy)

    def create(self, validated_data):
        password = validated_data.pop('password')
        
        # Récupérer les données de l'entreprise depuis l'attribut stocké dans to_internal_value
        entreprise_data = {}
        role = validated_data.get('role')
        
        if role == User.ROLE_ENTREPRISE:
            entreprise_fields = getattr(self, 'entreprise_fields', {})
            entreprise_data = {
                'nom': entreprise_fields.get('nom_entreprise', '') or validated_data.get('username', ''),
                'description': entreprise_fields.get('description_entreprise', ''),
                'domaine': entreprise_fields.get('domaine_entreprise', ''),
                'adresse': entreprise_fields.get('adresse_entreprise', ''),
                'ville': entreprise_fields.get('ville_entreprise', ''),
                'telephone': entreprise_fields.get('telephone_entreprise', ''),
            }
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        # Créer le profil entreprise avec les données fournies
        if user.role == User.ROLE_ENTREPRISE:
            from entreprises.models import Entreprise
            # Ne créer que si le profil n'existe pas déjà (le signal pourrait l'avoir créé)
            if not Entreprise.objects.filter(user=user).exists():
                Entreprise.objects.create(user=user, **entreprise_data)
            else:
                # Mettre à jour le profil existant
                entreprise = Entreprise.objects.get(user=user)
                for key, value in entreprise_data.items():
                    if value:  # Ne mettre à jour que si une valeur est fournie
                        setattr(entreprise, key, value)
                entreprise.save()
        
        return user

    def to_representation(self, instance):
        data = super().to_representation(instance)
        refresh = RefreshToken.for_user(instance)
        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get('email') or attrs.get('username')
        password = attrs.get('password')

        if not identifier or not password:
            raise serializers.ValidationError('Identifiant et mot de passe requis.')

        UserModel = get_user_model()
        try:
            user_obj = UserModel.objects.get(Q(username=identifier) | Q(email=identifier))
        except UserModel.DoesNotExist:
            raise serializers.ValidationError('Utilisateur introuvable.')

        if not user_obj.check_password(password):
            raise serializers.ValidationError('Mot de passe invalide.')

        if not user_obj.is_active:
            raise serializers.ValidationError('Compte inactif.')

        refresh = RefreshToken.for_user(user_obj)

        return {
            'user': UserSerializer(user_obj).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
