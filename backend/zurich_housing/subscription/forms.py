from django import forms

class SubscriptionForm(forms.Form):
    email = forms.EmailField(max_length=50, required=True)
    rentmin = forms.IntegerField(required=True)
    rentmax = forms.IntegerField(required=True)
    earlieststartdate = forms.DateField(required=True)
    woko = forms.BooleanField(required=False)
    ls = forms.BooleanField(required=False)
    wohnen = forms.BooleanField(required=False)
    wg = forms.BooleanField(required=False)
    studio = forms.BooleanField(required=False)
    flat = forms.BooleanField(required=False)

class UnsubscriptionForm(forms.Form):
    email = forms.EmailField(max_length=50, required=True)