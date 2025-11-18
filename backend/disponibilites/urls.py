from django.urls import path
from .views import (
    EntrepriseDisponibiliteListCreateView,
    EntrepriseDisponibiliteUpdateView,
    EntrepriseDisponibiliteDeleteView,
)

urlpatterns = [
    path('entreprise/disponibilites/', EntrepriseDisponibiliteListCreateView.as_view(), name='entreprise-disponibilites-list-create'),
    path('entreprise/disponibilites/<int:pk>/', EntrepriseDisponibiliteUpdateView.as_view(), name='entreprise-disponibilites-update'),
    path('entreprise/disponibilites/<int:pk>/delete/', EntrepriseDisponibiliteDeleteView.as_view(), name='entreprise-disponibilites-delete'),
]
