import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safespace_project.settings')
django.setup()

from users.models import CustomUser

users = CustomUser.objects.all()
print("Users:")
for u in users:
    print(f"  {u.username} (id={u.id}, partner={u.partner})")
