from django.core.mail import EmailMessage
from django.conf import settings

def send_no_reply_email(subject, body, to_email):
    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
        headers={'Reply-To': settings.SUPPORT_EMAIL}
    )
    return email.send() 

