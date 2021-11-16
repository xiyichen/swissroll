from .models import *
from .utils import ActivationTokenGenerator
from .exceptions import SubscriptionException, ConfirmationException, UnsubscriptionException
from django.db import transaction
from .logging import logger
from .cron import *

class SubscriptionService:
    def __init__(self, request, email, rentmin, rentmax, earlieststartdate, woko, ls, wohnen, wg, studio, flat):
        self.email = email.lower()
        self.rentmin = rentmin
        self.rentmax = rentmax
        self.earlieststartdate = earlieststartdate
        self.woko = woko
        self.ls = ls
        self.wohnen = wohnen
        self.wg = wg
        self.studio = studio
        self.flat = flat
        self.request = request

    def find_email(self):
        return User.objects.filter(email=self.email).first()

    def send_confirmation_email_to(self, user):
        emailbot = EmailBot()
        emailbot.send_confirmation_email(self.request, user)
        # check_woko_scheduler()
        # check_living_science_scheduler()
        # check_wohnenuzhethz_scheduler()
        # pass

    def fill_user_object(self, user):
        user.email = self.email
        user.rentmin = self.rentmin
        user.rentmax = self.rentmax
        user.earlieststartdate = self.earlieststartdate
        user.woko = self.woko
        user.ls = self.ls
        user.wohnen = self.wohnen
        user.wg = self.wg
        user.studio = self.studio
        user.flat = self.flat
        user.confirmation = False

    @transaction.atomic
    def execute(self):
        user = self.find_email()
        if not user:
            user = User.objects.create()
        self.fill_user_object(user)
        user.save()
        try:
            self.send_confirmation_email_to(user)
        except Exception as e:
            error_msg = "Subscription Failed! Confirmation email wasn't send successfully: {} ".format(str(e))
            logger.error(error_msg)
            raise SubscriptionException(error_msg)
        return user

class UnsubscriptionService:
    def __init__(self, email):
        self.email = email.lower()

    def execute(self):
        user = User.objects.filter(email=self.email.lower())
        user.delete()

    def from_email(self, token):
        user = User.objects.filter(email=self.email.lower()).first()
        if not user:
            return
        account_activation_token = ActivationTokenGenerator()
        if not account_activation_token.check_token(user, token):
            raise UnsubscriptionException("Subscription Confirmation Failed.")
        user.delete()

class ConfirmationService:
    def __init__(self, email, token):
        self.email = email
        self.token = token

    def execute(self):
        try:
            user = User.objects.all().get(email=self.email)
        except Exception as e:
            logger.error(str(e))
            raise ConfirmationException(str(e))

        account_activation_token = ActivationTokenGenerator()
        if not account_activation_token.check_token(user, self.token):
            raise ConfirmationException("Subscription Confirmation Failed.")

        user.confirmation = True
        user.save()