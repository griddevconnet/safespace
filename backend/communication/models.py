from django.db import models
from django.conf import settings

class MoodEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mood_entries')
    mood_value = models.IntegerField(default=50)  # e.g., 0-100 scale, or enum for specific emojis
    mood_label = models.CharField(max_length=50, blank=True)  # e.g., "Happy", "Sad", "Neutral"
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = "Mood Entries"

    def __str__(self):
        return f"{self.user.username} - {self.mood_label} ({self.mood_value}) at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

class PuzzleState(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='puzzle_states')
    partner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='partner_puzzle_states', null=True, blank=True)
    mood_category = models.CharField(max_length=50)  # e.g., 'reflection', 'emotions', 'wisdom', 'inspiration'
    current_word_index = models.IntegerField(default=0)
    completed_words = models.JSONField(default=list)  # List of completed word indices
    is_completed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name_plural = "Puzzle States"
        unique_together = ['user', 'mood_category']

    def __str__(self):
        return f"{self.user.username} - {self.mood_category} (word {self.current_word_index})"
