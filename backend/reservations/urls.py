from django.urls import path
from .views import (
    ClientReservationListView,
    ReservationCreateView,
    EntrepriseReservationListView,
    EntrepriseReservationUpdateView,
)

urlpatterns = [
    path('client/reservations/', ClientReservationListView.as_view(), name='client-reservations'),
    path('reservations/', ReservationCreateView.as_view(), name='reservation-create'),
    path('entreprise/reservations/', EntrepriseReservationListView.as_view(), name='entreprise-reservations'),
    path('entreprise/reservations/<int:pk>/', EntrepriseReservationUpdateView.as_view(), name='entreprise-reservation-update'),
]
