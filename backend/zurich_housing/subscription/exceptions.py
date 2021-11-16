class SubscriptionException(Exception):
    def __init__(self, message):
        super().__init__(message)

class UnsubscriptionException(Exception):
    def __init__(self, message):
        super().__init__(message)

class ConfirmationException(Exception):
    def __init__(self, message):
        super().__init__(message)