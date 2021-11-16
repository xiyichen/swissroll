from django.urls import path, re_path
from .views import *
from django.contrib import admin
from django.views.generic.base import RedirectView

app_name = 'subscription'

urlpatterns = [
    path(r'', subscribe, name='subscribe'),
    path(r'subscribe/', save, name='save'),
    path(r'unsubscribe/', delete, name='delete'),
    re_path(r'^confirm/(?P<emailb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,15}-[0-9A-Za-z]{1,35})(/)?$', confirm_redirect, name='confirm_redirect'),
    re_path(r'^validate_confirmation_link/$', confirm, name='confirm'),
    re_path(r'^unsubscribe/email/(?P<emailb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,15}-[0-9A-Za-z]{1,35})(/)?$', delete_from_email_redirect, name='delete_from_email_redirect'),
    re_path(r'^validate_unsubscription_link/$', delete_from_email, name='delete_from_email'),
]