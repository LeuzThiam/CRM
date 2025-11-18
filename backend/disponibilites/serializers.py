from rest_framework import serializers
from .models import Disponibilite


class DisponibiliteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disponibilite
        fields = [
            'id',
            'date',
            'heure_debut',
            'heure_fin',
            'capacite',
        ]
        read_only_fields = []

    def validate(self, attrs):
        date = attrs.get('date')
        heure_debut = attrs.get('heure_debut')
        heure_fin = attrs.get('heure_fin')
        entreprise = self.instance.entreprise if self.instance else None

        # Si c'est une création, l'entreprise sera définie dans perform_create
        if not entreprise and hasattr(self, 'context') and 'request' in self.context:
            request = self.context['request']
            if request and request.user:
                from entreprises.models import Entreprise
                try:
                    entreprise = Entreprise.objects.get(user=request.user)
                except Entreprise.DoesNotExist:
                    pass

        # Validation : heure_fin doit être après heure_debut
        if heure_debut and heure_fin and heure_fin <= heure_debut:
            raise serializers.ValidationError('L\'heure de fin doit être après l\'heure de début.')

        # Validation : pas de disponibilité dans le passé
        from datetime import date as date_class
        today = date_class.today()
        if date and date < today:
            raise serializers.ValidationError('Impossible de créer une disponibilité dans le passé.')

        # Validation : éviter les chevauchements (si entreprise est définie)
        if entreprise and date and heure_debut and heure_fin:
            overlapping = Disponibilite.objects.filter(
                entreprise=entreprise,
                date=date,
            ).exclude(
                heure_fin__lte=heure_debut
            ).exclude(
                heure_debut__gte=heure_fin
            )
            
            # Exclure l'instance actuelle si c'est une mise à jour
            if self.instance:
                overlapping = overlapping.exclude(id=self.instance.id)
            
            if overlapping.exists():
                raise serializers.ValidationError('Cette disponibilité chevauche avec une autre disponibilité existante.')

        # Validation : capacite doit être positive
        capacite = attrs.get('capacite', self.instance.capacite if self.instance else None)
        if capacite and capacite <= 0:
            raise serializers.ValidationError('La capacité doit être supérieure à 0.')

        return attrs
