import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

class MoodConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        from rest_framework.authtoken.models import Token
        from django.contrib.auth import get_user_model

        User = get_user_model()
        
        query_string = self.scope['query_string'].decode()
        token_key = None
        for param in query_string.split('&'):
            if param.startswith('token='):
                token_key = param.split('=')[1]
                break

        self.user = None
        if token_key:
            try:
                token = await database_sync_to_async(Token.objects.select_related('user').get)(key=token_key)
                self.user = token.user
            except Token.DoesNotExist:
                pass

        if self.user and self.user.is_authenticated:
            # Create a group name based on the user's ID
            self.user_group = f'user_{self.user.id}'
            
            # Add user to their own group to receive their partner's updates
            await self.channel_layer.group_add(
                self.user_group,
                self.channel_name
            )
            
            # If user has a partner, also add to partner's group
            try:
                # Fetch user with partner relationship to avoid lazy loading
                user_with_partner = await database_sync_to_async(
                    lambda: User.objects.select_related('partner').get(id=self.user.id)
                )()
                if user_with_partner.partner:
                    partner_group = f'user_{user_with_partner.partner.id}'
                    await self.channel_layer.group_add(
                        partner_group,
                        self.channel_name
                    )
            except Exception as e:
                print(f"Error accessing partner: {e}")
            
            await self.accept()
        else:
            await self.close()
            print("WebSocket connection rejected: User not authenticated.")

    async def disconnect(self, close_code):
        from django.contrib.auth import get_user_model

        if self.user and self.user.is_authenticated:
            # Remove from user's own group
            await self.channel_layer.group_discard(
                self.user_group,
                self.channel_name
            )
            
            # Remove from partner's group if exists
            try:
                User = get_user_model()
                user_with_partner = await database_sync_to_async(
                    lambda: User.objects.select_related('partner').get(id=self.user.id)
                )()
                if user_with_partner.partner:
                    partner_group = f'user_{user_with_partner.partner.id}'
                    await self.channel_layer.group_discard(
                        partner_group,
                        self.channel_name
                    )
            except Exception as e:
                print(f"Error accessing partner during disconnect: {e}")
            

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'ping':
            await self.send(text_data=json.dumps({
                'type': 'pong',
                'timestamp': text_data_json.get('timestamp')
            }))

    async def mood_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        sender_username = event['sender_username']

        await self.send(text_data=json.dumps({
            'type': 'mood_message',
            'message': message,
            'sender_id': sender_id,
            'sender_username': sender_username,
        }))

    async def puzzle_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        sender_username = event['sender_username']

        await self.send(text_data=json.dumps({
            'type': 'puzzle_message',
            'message': message,
            'sender_id': sender_id,
            'sender_username': sender_username,
        }))
