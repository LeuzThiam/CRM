from django.urls import path
from .views import (
    ClientReservationListView,
    ClientReservationDeleteView,
    ReservationCreateView,
    EntrepriseReservationListView,
    EntrepriseReservationUpdateView,
    EntrepriseReservationDeleteView,
)

urlpatterns = [
    path('client/reservations/', ClientReservationListView.as_view(), name='client-reservations'),
    path('client/reservations/<int:pk>/', ClientReservationDeleteView.as_view(), name='client-reservation-delete'),
    path('reservations/', ReservationCreateView.as_view(), name='reservation-create'),
    path('entreprise/reservations/', EntrepriseReservationListView.as_view(), name='entreprise-reservations'),
    path('entreprise/reservations/<int:pk>/', EntrepriseReservationUpdateView.as_view(), name='entreprise-reservation-update'),
    path('entreprise/reservations/<int:pk>/annuler/', EntrepriseReservationDeleteView.as_view(), name='entreprise-reservation-delete'),
]
