#!/bin/bash

# Run database migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start the server
uvicorn safespace_project.asgi:application --host 0.0.0.0 --port $PORT
