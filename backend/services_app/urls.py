from django.urls import path
from .views import (
    EntrepriseServiceListCreateView,
    EntrepriseServiceDetailView,
)

urlpatterns = [
    path('entreprise/services/', EntrepriseServiceListCreateView.as_view(), name='entreprise-services-list-create'),
    path('entreprise/services/<int:pk>/', EntrepriseServiceDetailView.as_view(), name='entreprise-services-detail'),
]
