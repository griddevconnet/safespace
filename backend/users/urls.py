from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, PartnerCodeView, ConnectPartnerView, DisconnectPartnerView, ProfileUpdateView, PrivacySettingsView, PushSubscriptionView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('me/update/', ProfileUpdateView.as_view(), name='profile-update'),
    path('privacy/', PrivacySettingsView.as_view(), name='privacy-settings'),
    path('push-subscription/', PushSubscriptionView.as_view(), name='push-subscription'),
    path('partner-code/', PartnerCodeView.as_view(), name='partner-code'),
    path('connect/', ConnectPartnerView.as_view(), name='connect-partner'),
    path('disconnect/', DisconnectPartnerView.as_view(), name='disconnect-partner'),
]
