from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/entreprises/', include('entreprises.public_urls')),
    path('api/', include('entreprises.private_urls')),
    path('api/', include('services_app.urls')),
    path('api/', include('disponibilites.urls')),
    path('api/', include('reservations.urls')),
]
