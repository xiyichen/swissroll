from django.db import models
from django.utils import timezone

# Create your models here.

class User(models.Model):
    email = models.EmailField(unique=False)
    confirmation = models.BooleanField(default=False)
    rentmin = models.PositiveIntegerField(default=300)
    rentmax = models.PositiveIntegerField(default=1000)
    earlieststartdate = models.DateField(default=timezone.now)
    woko = models.BooleanField(default=True)
    ls = models.BooleanField(default=True)
    wohnen = models.BooleanField(default=False)
    wg = models.BooleanField(default=True)
    studio = models.BooleanField(default=True)
    flat = models.BooleanField(default=True)

    def __str__(self):
        return self.email

class WOKO(models.Model):
    link_id = models.CharField(primary_key=True, unique=True, max_length=20)

    def __str__(self):
        return self.link_id

class LivingScience(models.Model):
    apartment_nr = models.CharField(primary_key=True, unique=True, max_length=20)

    def __str__(self):
        return self.apartment_nr

class WohnenUZHETHZ(models.Model):
    apartment_nr = models.CharField(primary_key=True, unique=True, max_length=20)

    def __str__(self):
        return self.apartment_nr