from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.


   
class Room(models.Model):
    ROOM_TYPES = [
        ('suite', 'Suite'),
        ('standard', 'Standard Room'),
        ('deluxe', 'Deluxe Room'),
    ]
    
    ROOM_NUMBER_CHOICES = [
        (1, 'Room 1'),
        (2, 'Room 2'),
        (3, 'Room 3'),
        (4, 'Room 4'),
        (5, 'Room 5'),
        (6, 'Room 6'),
        (7, 'Room 7'),
        (8, 'Room 8'),
        (9, 'Room 9'),
        (10, 'Room 10'),
    ]
    
    CURRENCY_TYPES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('ZAR', 'South African Rand'),
    ]   
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=ROOM_TYPES)
    price_per_night = models.IntegerField(default=150)
    currency = models.CharField(max_length=3, choices=CURRENCY_TYPES, default='ZAR')
    max_occupancy = models.IntegerField(default=2)
    description = models.TextField(max_length=1000)
    
    def __str__(self):
        return f"{self.name} ({self.type})"
    
    
class RoomImage(models.Model):
    image = models.ImageField(upload_to='room_images/')
    caption = models.CharField(max_length=255, blank=True, null=True)
    room = models.ForeignKey(Room,related_name="images",on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Image for {self.room.name} - {self.caption or 'No caption'}"
    

class OccupiedDate(models.Model):
    room = models.ForeignKey(Room, related_name='occupied_dates', on_delete=models.CASCADE)
    User = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='occupied_dates')
    date = models.DateField()
    
    class Meta:
        unique_together = ('room', 'date')
    
    def __str__(self):
        return f"{self.date} - {self.room.name} booked by {self.User.username}"
    
    
class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150, blank="")
     
   
