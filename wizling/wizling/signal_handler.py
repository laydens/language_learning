from django.dispatch import receiver
from allauth.account.signals import email_confirmed
import logging

logger = logging.getLogger(__name__)

@receiver(email_confirmed)
def my_email_confirmed_handler(sender, request, email_address, **kwargs):
    logger.debug(f"Email confirmed: Email Address={email_address.email}, Request={request}, Kwargs={kwargs}")
    print(f"Email confirmed: Email Address={email_address.email}, Request={request}, Kwargs={kwargs}")
    # Add more detailed logging here if needed (e.g., try to access email content from kwargs if possible)
