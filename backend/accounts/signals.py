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
        Client.objects.create(user=instance)
    elif role == 'entreprise':
        Entreprise = django_apps.get_model('entreprises', 'Entreprise')
        Entreprise.objects.create(user=instance, nom=instance.username)
