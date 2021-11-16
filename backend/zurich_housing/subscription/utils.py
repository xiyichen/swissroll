from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from tzlocal import get_localzone
from django.utils.http import urlsafe_base64_decode
from dateutil import tz
from selenium import webdriver

class ActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return str(timestamp) + str(user.email) + str(user.rentmin) + str(user.rentmax) + \
               user.earlieststartdate.strftime('%d.%m.%Y') + str(user.woko) + str(user.ls) + \
               str(user.wohnen) + str(user.wg) + str(user.studio) + str(user.flat)

def make_token(user):
    account_activation_token = ActivationTokenGenerator()
    return account_activation_token.make_token(user)

def encodeb64(content):
    return urlsafe_base64_encode(force_bytes(content))

def decodeb64(content):
    return force_bytes(urlsafe_base64_decode(content)).decode('utf-8')

def as_timezone(date_time, to_zone):
    date_time_tzone = date_time.replace(tzinfo=tz.gettz(to_zone))
    return date_time_tzone

def as_swiss_timezone(datetime):
    return as_timezone(datetime, 'Europe/Zurich')

def convert_to_timezone(date_time, to_zone):
    from_zone = tz.gettz(str(get_localzone()))
    to_zone = tz.gettz(to_zone)
    date_time_tzone = date_time.replace(tzinfo=from_zone)
    return date_time_tzone.astimezone(to_zone)

def convert_to_swiss_timezone(date_time):
    return convert_to_timezone(date_time, 'Europe/Zurich')

def get_requests_headers():
    return {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) '
                          'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'}

def get_selenium_headers():
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(executable_path='/usr/bin/chromedriver', options=chrome_options)
    return driver

def get_woko_type(address, rent, title):
    if 'studio' in title:
        return 'studio'
    if address.upper() == 'GSTEIGSTRASSE 18, 8049 ZÜRICH':
        return 'studio'
    if address.upper() == 'HIRZENBACHSTRASSE 4, 8051 ZÜRICH' and rent >= 800:
        return 'studio'
    if address.upper() == 'UETLIBERGSTRASSE 111/111A/111B, 8045 ZÜRICH' and rent >= 870:
        return 'studio'
    if address.upper() == 'AM WASSER 6/15, 8600 DÜBENDORF' and rent >= 1000:
        return 'studio'
    if address.upper() == 'ALTE LANDSTRASSE 98, 8702 ZOLLIKON' and rent >= 1000:
        return 'studio'
    if address.upper() == 'ALTSTETTERSTRASSE 183, 8048 ZÜRICH':
        return 'studio'
    return 'shared apartment'