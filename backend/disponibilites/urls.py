from django.urls import path
from .views import (
    EntrepriseDisponibiliteListCreateView,
    EntrepriseDisponibiliteDeleteView,
)

urlpatterns = [
    path('entreprise/disponibilites/', EntrepriseDisponibiliteListCreateView.as_view(), name='entreprise-disponibilites-list-create'),
    path('entreprise/disponibilites/<int:pk>/', EntrepriseDisponibiliteDeleteView.as_view(), name='entreprise-disponibilites-delete'),
]
