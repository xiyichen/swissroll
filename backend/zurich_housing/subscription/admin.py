from django.contrib import admin

# Register your models here.

from .models import User, WOKO, LivingScience, WohnenUZHETHZ

class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'confirmation',)

admin.site.register(User, UserAdmin)
admin.site.register(WOKO)
admin.site.register(LivingScience)
admin.site.register(WohnenUZHETHZ)