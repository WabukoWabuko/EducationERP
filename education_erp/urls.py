from django.urls import path
from .views import LoginView, StudentView

urlpatterns = [
    path('login/', LoginView.as_view(), name='api-login'),
    path('students/', StudentView.as_view(), name='students'),
]
