from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('education_erp.urls')),  # Auth routes
    path('accounts/', include('allauth.urls')),  # allauth routes
]
