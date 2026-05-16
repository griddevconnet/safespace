from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Add any custom fields here if needed, e.g., 'partner_code' or 'display_name'
    partner_code = models.CharField(max_length=8, unique=True, blank=True, null=True)
    partner = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='partner_of')

    def save(self, *args, **kwargs):
        if not self.partner_code:
            import random
            import string
            self.partner_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.partner_code or 'No code'})"
