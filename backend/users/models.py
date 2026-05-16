from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Add any custom fields here if needed, e.g., 'partner_code' or 'display_name'
    partner_code = models.CharField(max_length=8, unique=True, blank=True, null=True)
    partner = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='partner_of')

    # Profile fields
    display_name = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_private = models.BooleanField(default=False)
    show_mood_to_partner = models.BooleanField(default=True)
    show_activity_status = models.BooleanField(default=True)
    notification_enabled = models.BooleanField(default=True)
    notification_sound = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.partner_code:
            import random
            import string
            self.partner_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.partner_code or 'No code'})"
