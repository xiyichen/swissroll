from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import SubscriptionForm, UnsubscriptionForm
from .services import SubscriptionService, UnsubscriptionService, ConfirmationService
from .utils import decodeb64
from .logging import logger
from django.http import JsonResponse, HttpResponseRedirect
import json
from django.shortcuts import redirect

from django.views.decorators.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie

def subscribe(request):
    return render(request, 'index.html')

# def get_csrf(request):
#     return JsonResponse({"code": get_token(request)})

# @ensure_csrf_cookie
@csrf_exempt
def save(request):
    if request.method == 'POST':
        form = SubscriptionForm(json.loads(request.body))
        if form.is_valid():
            subscriptionService = SubscriptionService(request, **form.cleaned_data)
            try:
                subscriptionService.execute()
                msg = 'Thank you for your subscription! A confirmation email has been sent to your email address. ' \
                      'Please follow the instructions there to confirm your subscription! '
                return JsonResponse({"status": "success", "msg": msg})
            except Exception as e:
                logger.error(str(e))
                return JsonResponse({"status": "error", "msg": str(e)})
        else:
            logger.error(str(form.errors))
            return JsonResponse({"status": "error", "msg": 'Form validation failed: {}'.format(form.errors)})

@csrf_exempt
def delete(request):
    if request.method == 'POST':
        form = UnsubscriptionForm(json.loads(request.body))
        if form.is_valid():
            unSubscriptionService = UnsubscriptionService(**form.cleaned_data)
            unSubscriptionService.execute()
            msg = 'You have unsubscribed successfully! '
            return JsonResponse({"status": "success", "msg": msg})
        else:
            logger.error(str(form.errors))
            return JsonResponse({"status": "error", "msg": 'Form validation failed. {}'.format(form.errors)})

@csrf_exempt
def confirm(request):
    if request.method == 'POST':
        link = json.loads(request.body)['link']
        tokens = link.split('confirm')[-1].split('/')[1:3]
        emailb64 = tokens[0]
        token = tokens[1]
        try:
            email = decodeb64(emailb64)
            confirmationService = ConfirmationService(email, token)
            confirmationService.execute()
            msg = 'You have successfully confirmed your subscription!'
            return JsonResponse({"status": "success", "msg": msg})
        except Exception as e:
            logger.error(str(e))
            return JsonResponse({"status": "error", "msg": 'Confirmation failed! Invalid confirmation link. '})

@csrf_exempt
def delete_from_email(request):
    if request.method == 'POST':
        link = json.loads(request.body)['link']
        tokens = link.split('email')[-1].split('/')[1:3]
        emailb64 = tokens[0]
        token = tokens[1]
        try:
            email = decodeb64(emailb64)
            unSubscriptionService = UnsubscriptionService(email)
            unSubscriptionService.from_email(token)
            msg = 'You have unsubscribed successfully! '
            return JsonResponse({"status": "success", "msg": msg})
        except Exception as e:
            logger.error(str(e))
            return JsonResponse({"status": "error", "msg": 'Confirmation failed! Invalid unsubscription link. '})

from django.conf import settings

def redirect(request, *args):
    print(settings.BASE_DIR)
    return HttpResponseRedirect('/')

def confirm_redirect(request, emailb64, token):
    return render(request, 'index.html')

def delete_from_email_redirect(request, emailb64, token):
    return render(request, 'index.html')

