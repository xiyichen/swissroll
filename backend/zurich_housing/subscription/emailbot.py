from zurich_housing import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from .utils import make_token, encodeb64
from .models import User
from time import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from django.contrib.sites.shortcuts import get_current_site
from django.db.models import Q

class EmailBot:
    def __init__(self):
        self.sender = settings.EMAIL_HOST_USER

    def get_recipients_on_condition(self, website, listing_type, rooms, rent, start_date):
        recipients = []
        arguments_dictionary = {
            'confirmation': True,
            'rentmin__lte': rent,
            'rentmax__gte': rent,
            'earlieststartdate__lte': datetime.strptime(start_date, '%d.%m.%Y')
        }

        if website == 'WOKO':
            arguments_dictionary['woko'] = True
        elif website == 'Living Science':
            arguments_dictionary['ls'] = True
        elif website == 'Housing Office of University / ETH Zurich':
            arguments_dictionary['wohnen'] = True

        if listing_type == 'flat' and rooms <= 1.5:
            users = User.objects.filter(Q(studio=True) | Q(flat=True), **arguments_dictionary)
        else:
            if listing_type == 'flat':
                arguments_dictionary['flat'] = True
            if listing_type == 'studio':
                arguments_dictionary['studio'] = True
            else:
                arguments_dictionary['wg'] = True
            users = User.objects.filter(**arguments_dictionary)

        for user in users:
            recipients.append(user)
        return recipients

    def get_all_confirmed_recipients(self):
        recipients = []
        users = User.objects.filter(confirmation=True)
        for user in users:
            recipients.append(user)
        return recipients

    def send_one_update_email(self, recipient, website, item_title, item_content):
        template = get_template('update_notification.html')
        token = make_token(recipient)
        d = {
            'item_title': item_title,
            'item_content': item_content,
            'email': recipient.email,
            'encoded_email': encodeb64(recipient.email),
            'token': token
        }
        html_content = template.render(d)
        msg = EmailMultiAlternatives(subject='You have a new housing option from {}!'.format(website),
                                     from_email=self.sender,
                                     to=[recipient.email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()

    def send_update_emails(self, website, items_title_list, items_content_list):
        start = time()
        for item_title, item_content in zip(items_title_list, items_content_list):
            recipients = self.get_recipients_on_condition(website, item_title['Type'], item_title['Rooms'],
                                             item_content['Monthly Rent'], item_content['Start Date'])
            with ThreadPoolExecutor(max_workers=10) as executor:
                for recipient in recipients:
                    executor.submit(self.send_one_update_email, recipient, website, item_title, item_content)
            print('Sent notifications for {} (listing_id: {}) to {} recipients.'.format(website, item_title['listing_id'],
                                                                                        len(recipients)))
        print('All done! Time taken: {:.2f} seconds.'.format(time() - start))

    def send_confirmation_email(self, request, user):
        current_site = get_current_site(request)
        token = make_token(user)
        template = get_template('confirm_subscription.html')
        d = {
            'domain': current_site.domain,
            'email': user.email,
            'encoded_email': encodeb64(user.email),
            'token': token,
            'rentmin': user.rentmin,
            'rentmax': (user.rentmax if user.rentmax <= 2000 else 'More than 2000'),
            'earliest_start_date': user.earlieststartdate.strftime('%d.%m.%Y')
        }
        subscribed_types = []
        if user.wg:
            subscribed_types.append('Rooms in shared apartments')
        if user.studio:
            subscribed_types.append('Studios')
        if user.flat:
            subscribed_types.append('Entire flats')
        subscribed_sites = []
        if user.woko:
            subscribed_sites.append(('https://woko.ch/', 'WOKO'))
        if user.ls:
            subscribed_sites.append(('https://livingscience.ch/', 'Living Science'))
        if user.wohnen:
            subscribed_sites.append(('https://wohnen.ethz.ch/', 'Housing Office of University / ETH Zurich'))
        d['subscribed_types'] = subscribed_types
        d['subscribed_sites'] = subscribed_sites
        html_content = template.render(d)
        msg = EmailMultiAlternatives(subject='Confirm your subscription',
                                     from_email=self.sender,
                                     to=[user.email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()