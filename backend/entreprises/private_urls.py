from django.urls import path
from .views import MonProfilView

urlpatterns = [
    path('entreprise/mon-profil/', MonProfilView.as_view(), name='entreprise-mon-profil'),
]
