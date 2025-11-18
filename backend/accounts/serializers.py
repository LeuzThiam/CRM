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

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
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
