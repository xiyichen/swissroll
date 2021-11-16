from django import template
register = template.Library()

@register.filter(name='access')
def access(dict, key):
    return dict[key]

@register.filter(name='length')
def length(l):
    return len(l)