from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .models import PushSubscription

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'display_name', 'bio', 'avatar', 'birth_date', 'phone_number', 
                  'is_private', 'show_mood_to_partner', 'show_activity_status', 'notification_enabled', 'notification_sound')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Automatically create a token for the user upon registration
        Token.objects.create(user=user)
        return user

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('display_name', 'bio', 'avatar', 'birth_date', 'phone_number')
        extra_kwargs = {
            'display_name': {'required': False},
            'bio': {'required': False},
            'avatar': {'required': False},
            'birth_date': {'required': False},
            'phone_number': {'required': False},
        }

class PushSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PushSubscription
        fields = ('endpoint', 'p256dh', 'auth')
