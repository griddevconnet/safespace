from rest_framework import serializers
from .models import MoodEntry, PuzzleState
from users.serializers import UserSerializer

class MoodEntrySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = MoodEntry
        fields = ('id', 'user', 'mood_value', 'mood_label', 'timestamp')
        read_only_fields = ('user',)

class MoodUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodEntry
        fields = ('mood_value', 'mood_label')

class PuzzleStateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    partner = UserSerializer(read_only=True)

    class Meta:
        model = PuzzleState
        fields = ('id', 'user', 'partner', 'mood_category', 'current_word_index', 'completed_words', 'is_completed', 'timestamp', 'updated_at')
        read_only_fields = ('user', 'partner', 'timestamp', 'updated_at')

class PuzzleStateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuzzleState
        fields = ('current_word_index', 'completed_words', 'is_completed')
