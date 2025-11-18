from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps as django_apps

User = get_user_model()


@receiver(post_save, sender=User)
def create_profile_for_new_user(sender, instance, created, **kwargs):
    if not created:
        return

    role = getattr(instance, 'role', None)

    if role == 'client':
        Client = django_apps.get_model('clients', 'Client')
        # Ne créer que si le profil n'existe pas déjà
        if not Client.objects.filter(user=instance).exists():
            Client.objects.create(user=instance)
    elif role == 'entreprise':
        Entreprise = django_apps.get_model('entreprises', 'Entreprise')
        # Ne créer que si le profil n'existe pas déjà (peut être créé par le serializer)
        if not Entreprise.objects.filter(user=instance).exists():
            Entreprise.objects.create(user=instance, nom=instance.username)
