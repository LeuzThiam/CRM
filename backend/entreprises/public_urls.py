from django.urls import path
from .views import (
    EntrepriseListView,
    EntrepriseDetailView,
    EntrepriseServicesPublicView,
    EntrepriseDisponibilitesPublicView,
)

urlpatterns = [
    path('', EntrepriseListView.as_view(), name='entreprise-list'),
    path('<int:pk>/', EntrepriseDetailView.as_view(), name='entreprise-detail'),
    path('<int:pk>/services/', EntrepriseServicesPublicView.as_view(), name='entreprise-services-public'),
    path('<int:pk>/disponibilites/', EntrepriseDisponibilitesPublicView.as_view(), name='entreprise-disponibilites-public'),
]
