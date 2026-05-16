from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import MoodEntry, PuzzleState
from .serializers import MoodEntrySerializer, MoodUpdateSerializer, PuzzleStateSerializer, PuzzleStateUpdateSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

User = get_user_model()

class MoodEntryViewSet(viewsets.ModelViewSet):
    queryset = MoodEntry.objects.all()
    serializer_class = MoodEntrySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        self._notify_partner_mood_change(instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        self._notify_partner_mood_change(instance)

    def _notify_partner_mood_change(self, mood_entry):
        channel_layer = get_channel_layer()
        user = mood_entry.user
        
        # Send to the user's partner's group if they have a partner
        if user.partner:
            partner_group = f'user_{user.partner.id}'
            async_to_sync(channel_layer.group_send)(
                partner_group,
                {
                    'type': 'mood_message',
                    'message': MoodEntrySerializer(mood_entry).data,
                    'sender_id': str(mood_entry.user.id),
                    'sender_username': mood_entry.user.username,
                }
            )

    @action(detail=False, methods=['get'], url_path='my-latest')
    def my_latest_mood(self, request):
        latest_mood = self.get_queryset().first()
        if latest_mood:
            serializer = self.get_serializer(latest_mood)
            return Response(serializer.data)
        return Response({}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='partner-latest')
    def partner_latest_mood(self, request):
        partner_id = request.GET.get('partner_id')
        if not partner_id:
            if request.user.username == 'desmond':
                partner = User.objects.filter(username='girlfriend').first()
            else:
                partner = User.objects.filter(username='desmond').first()
            
            if not partner:
                return Response({'detail': 'Partner not found or configured.'}, status=status.HTTP_404_NOT_FOUND)
            partner_id = partner.id

        try:
            partner_latest_mood = MoodEntry.objects.filter(user_id=partner_id).first()
            if partner_latest_mood:
                serializer = self.get_serializer(partner_latest_mood)
                data = serializer.data
                data['mood_value'] = 'generalized_value'
                data['mood_label'] = self._get_generalized_mood_label(partner_latest_mood.mood_value)
                return Response(data)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        except MoodEntry.DoesNotExist:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
    
    def _get_generalized_mood_label(self, mood_value):
        if mood_value < 30: return "Not feeling great"
        if mood_value < 70: return "Doing okay"
        return "Feeling good!"

class PuzzleStateViewSet(viewsets.ModelViewSet):
    queryset = PuzzleState.objects.all()
    serializer_class = PuzzleStateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Set partner from user's partner relationship
        partner = self.request.user.partner
        instance = serializer.save(user=self.request.user, partner=partner)
        self._notify_partner_puzzle_update(instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        self._notify_partner_puzzle_update(instance)

    def _notify_partner_puzzle_update(self, puzzle_state):
        channel_layer = get_channel_layer()
        user = puzzle_state.user
        
        # Send to the user's partner's group if they have a partner
        if user.partner:
            partner_group = f'user_{user.partner.id}'
            async_to_sync(channel_layer.group_send)(
                partner_group,
                {
                    'type': 'puzzle_message',
                    'message': PuzzleStateSerializer(puzzle_state).data,
                    'sender_id': str(puzzle_state.user.id),
                    'sender_username': puzzle_state.user.username,
                }
            )

    @action(detail=False, methods=['get'], url_path='category/(?P<mood_category>[^/.]+)')
    def get_by_category(self, request, mood_category=None):
        try:
            puzzle_state = self.get_queryset().get(mood_category=mood_category)
            serializer = self.get_serializer(puzzle_state)
            return Response(serializer.data)
        except PuzzleState.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='update-progress')
    def update_progress(self, request):
        mood_category = request.data.get('mood_category')
        current_word_index = request.data.get('current_word_index')
        completed_words = request.data.get('completed_words', [])
        is_completed = request.data.get('is_completed', False)

        if not mood_category:
            return Response({'error': 'mood_category is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            puzzle_state, created = self.get_queryset().get_or_create(
                user=request.user,
                mood_category=mood_category,
                defaults={
                    'current_word_index': current_word_index or 0,
                    'completed_words': completed_words,
                    'is_completed': is_completed
                }
            )

            if not created:
                puzzle_state.current_word_index = current_word_index
                puzzle_state.completed_words = completed_words
                puzzle_state.is_completed = is_completed
                puzzle_state.save()

            serializer = self.get_serializer(puzzle_state)
            self._notify_partner_puzzle_update(puzzle_state)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
