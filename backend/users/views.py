from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            partner_id = user.partner.id if user.partner else None
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'partner_code': user.partner_code,
                'partner_id': partner_id
            })
        else:
            return Response({'error': 'Invalid Credentials'}, status=400)

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class PartnerCodeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        """Get current user's partner code"""
        user = request.user
        return Response({
            'partner_code': user.partner_code,
            'has_partner': bool(user.partner),
            'partner': UserSerializer(user.partner).data if user.partner else None
        })

class ConnectPartnerView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        """Connect with a partner using their partner code"""
        partner_code = request.data.get('partner_code')
        if not partner_code:
            return Response({'error': 'Partner code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            partner = User.objects.get(partner_code=partner_code)
        except User.DoesNotExist:
            return Response({'error': 'Invalid partner code'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        # Check if already connected
        if user.partner:
            return Response({'error': 'You already have a partner'}, status=status.HTTP_400_BAD_REQUEST)

        if partner.partner:
            return Response({'error': 'This user already has a partner'}, status=status.HTTP_400_BAD_REQUEST)

        if partner == user:
            return Response({'error': 'Cannot connect with yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # Create mutual connection
        user.partner = partner
        partner.partner = user
        user.save()
        partner.save()

        return Response({
            'message': 'Successfully connected with partner',
            'partner': UserSerializer(partner).data
        })

class DisconnectPartnerView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        """Disconnect from current partner"""
        user = request.user
        if not user.partner:
            return Response({'error': 'No partner to disconnect'}, status=status.HTTP_400_BAD_REQUEST)

        partner = user.partner
        
        # Remove mutual connection
        user.partner = None
        partner.partner = None
        user.save()
        partner.save()

        return Response({'message': 'Successfully disconnected from partner'})
