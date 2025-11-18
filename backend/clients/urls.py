from django.urls import path
from .views import ClientProfileView

urlpatterns = [
    path('client/mon-profil/', ClientProfileView.as_view(), name='client-mon-profil'),
]
