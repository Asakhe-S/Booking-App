from rest_framework import serializers
from .models import Room, RoomImage, OccupiedDate, User

class RoomImageSerializer(serializers.ModelSerializer):
    room = serializers.HyperlinkedRelatedField(view_name = 'room-detail', queryset=Room.objects.all())
    class Meta:
        model = RoomImage
        fields = ['id', 'image', 'caption', 'room']

class OccupiedDatesSerializer(serializers.HyperlinkedModelSerializer):
    room = serializers.HyperlinkedRelatedField(view_name = 'room-detail', queryset=Room.objects.all())
    # Expose the room type (read-only) so frontend can display it without
    # requiring an extra request for the room detail.
    room_type = serializers.CharField(source='room.type', read_only=True)
    # Model uses a field named `User` (capital U). Map incoming `user` JSON key
    # to the model field `User` using `source` to avoid unexpected kwarg errors.
    user = serializers.HyperlinkedRelatedField(
        view_name='user-detail', queryset=User.objects.all(), source='User'
    )
    class Meta:
        model = OccupiedDate
        fields = ['url', 'id', 'room', 'room_type', 'date', 'user']

class RoomSerializer(serializers.HyperlinkedModelSerializer):
    images = RoomImageSerializer(many=True, read_only=True)
    occupied_dates = OccupiedDatesSerializer(many=True, read_only=True)
    class Meta:
        model = Room
        fields = ['id', 'name', 'type', 'price_per_night', 'currency', 'max_occupancy', 'description', 'images', 'occupied_dates']
        
       
        

from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'id' ,'username', 'password', 'email', 'full_name']
        
    def validate_password(self, value):
        return make_password(value)