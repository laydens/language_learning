"""
Django settings for wizling project.
Environment-aware configuration supporting both local and Google Cloud deployment.
"""
import os
from pathlib import Path
from django.utils.translation import gettext_lazy as _
import logging 
import sys
from django.dispatch import receiver
from allauth.account.signals import email_confirmed

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


logger = logging.getLogger(__name__)
# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

#ROOT URLCONF
ROOT_URLCONF = 'wizling.urls'

# Determine environment
IN_PRODUCTION = os.getenv('GAE_APPLICATION', None) is not None

# Load env file only in local development
if not IN_PRODUCTION:
    from dotenv import load_dotenv
    load_dotenv()

# Core Settings
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-5nz3$_^&_u(*v)e20mk@@ag6j(g0_0z#z5&5$zly6wst=b$b6x')
DEBUG = os.getenv('DEBUG', 'True') == 'True'

DEFAULT_DOMAINS = [
    'localhost',
    '127.0.0.1',
    'djangocms-649684198786.us-central1.run.app',
    '.run.app'
]

# Use explicit hosts in production, fallback to DEFAULT_DOMAINS in development
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    'djangocms-649684198786.us-central1.run.app',
    '.run.app',  # The dot prefix allows all subdomains
    '.wizling.com',  # Allows all subdomains of wizling.com
    'wizling.com',
]

# CSRF settings should be equally explicit
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'https://djangocms-649684198786.us-central1.run.app',
    'https://*.run.app',
    'https://*.wizling.com',
    'https://wizling.com',
    'http://*.wizling.com',
]

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL_ORIGINS', 'False') == 'True'
CORS_ALLOW_CREDENTIALS = os.getenv('CORS_ALLOW_CREDENTIALS', 'False') == 'True'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React development server
    "http://127.0.0.1:3000",
]


# local MySQL DATABASES
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('CMS_DB', 'language_learning_cms'),
        'USER': os.getenv('CMS_DB_USER', 'cms_user'),
        'PASSWORD': os.getenv('CMS_DB_PASSWORD'),
        'HOST': os.getenv('CMS_DB_HOST', '127.0.0.1'),
        'PORT': os.getenv('CMS_DB_PORT', '3306') if os.getenv('CMS_DB_HOST') == '127.0.0.1' else '',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci'
        }
    },
    'language_learning': {
        'ENGINE': 'django.db.backends.mysql',  # or 'django.db.backends.postgresql' if using PostgreSQL
        'NAME': os.getenv('LANGUAGE_LEARNING_DB', 'language_learning'),  # Use environment variable or default
        'USER': os.getenv('LANGUAGE_LEARNING_DB_USER', 'lang_user'),  # Use environment variable or default
        'PASSWORD': os.getenv('LANGUAGE_LEARNING_DB_PASSWORD', ''),  # Use environment variable or default
        'HOST': os.getenv('LANGUAGE_LEARNING_DB_HOST', '127.0.0.1'),  # Use environment variable or default
        'PORT': os.getenv('CMS_DB_PORT', '3306') if os.getenv('CMS_DB_HOST') == '127.0.0.1' else '',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci'
        }
    }
}

# BlueHost MySQL DATABASES
# DATABASES = { 
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': os.getenv('BLUEHOST_DB', 'namikoab_wizling_cms'),
#         'USER': os.getenv('BLUEHOST_DB_USER', 'namikoab_wiz_cms'),
#         'PASSWORD': os.getenv('BLUEHOST_DB_PASSWORD', '123qwe!@#QWE'),
#         'HOST': os.getenv('BLUEHOST_DB_HOST', 'box5858.bluehost.com'),
#         'PORT': os.getenv('CMS_DB_PORT', '3306'),
#         'OPTIONS': {
#             'charset': 'utf8mb4',
#             'init_command': 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci'
#         }
#     }
# }

# Application definition
INSTALLED_APPS = [
    # 'wagtail.contrib.forms',
    # 'wagtail.contrib.redirects',
    # 'wagtail.embeds',
    # 'wagtail.sites',
    # 'wagtail.users',
    # 'wagtail.snippets',
    # 'wagtail.documents',
    # 'wagtail.images',
    # 'wagtail.search',
    # 'wagtail.admin',
    # 'wagtail',
    # 'modelcluster',
    'taggit',
    'djangocms_admin_style',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'cms',
    'menus',
    'djangocms_text_ckeditor',
    'djangocms_alias',
    'djangocms_versioning',
    'sekizai',
    'treebeard',
    'parler',
    'filer',
    'easy_thumbnails',
    'djangocms_frontend',
    'djangocms_frontend.contrib.accordion',
    'djangocms_frontend.contrib.alert',
    'djangocms_frontend.contrib.badge',
    'djangocms_frontend.contrib.card',
    'djangocms_frontend.contrib.carousel',
    'djangocms_frontend.contrib.collapse',
    'djangocms_frontend.contrib.content',
    'djangocms_frontend.contrib.grid',
    'djangocms_frontend.contrib.icon',
    'djangocms_frontend.contrib.image',
    'djangocms_frontend.contrib.jumbotron',
    'djangocms_frontend.contrib.link',
    'djangocms_frontend.contrib.listgroup',
    'djangocms_frontend.contrib.media',
    'djangocms_frontend.contrib.navigation',
    'djangocms_frontend.contrib.tabs',
    'djangocms_frontend.contrib.utilities',
    'rest_framework',
    'corsheaders',
    'api.core',
    'api',
    'api.japanese.apps.JapaneseConfig',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    # If you want social authentication, add providers here:
    # 'allauth.socialaccount.providers.google',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'cms.middleware.user.CurrentUserMiddleware',
    'cms.middleware.page.CurrentPageMiddleware',
    'cms.middleware.toolbar.ToolbarMiddleware',
    # 'django.middleware.locale.LocaleMiddleware',
    'cms.middleware.language.LanguageCookieMiddleware'
    # 'wagtail.contrib.redirects.middleware.RedirectMiddleware',
]

# Static Files Configuration

STATIC_URL = '/static/'  # URL prefix for static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Where collectstatic will put files
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "wizling", "static"),  # Where your source static files live
    os.path.join(BASE_DIR, "frontend/build"),
    os.path.join(BASE_DIR, "frontend/build/static"),
]

CMS_PERMISSION = True
CMS_CONFIRM_VERSION4 = True
# Media Files Configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
WAGTAILADMIN_BASE_URL = os.getenv('WAGTAILADMIN_BASE_URL', 'localhost:8080')
# Templates Configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "wizling", "templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.i18n',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'sekizai.context_processors.sekizai',
                'cms.context_processors.cms_settings',
            ],
        },
    },
]

# Internationalization
LANGUAGE_CODE = 'en'
LANGUAGES = [
    ("en", _("English")),
]
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_THOUSAND_SEPARATOR = True
USE_TZ = True

# CMS Configuration
SITE_ID = 1
CMS_TEMPLATES = (
    ("base.html", _("Standard")),
    ("drop.html", _("KanaDropGame")),
    ("cards.html", _("Cards")),
)
CMS_PERMISSION = True
TEXT_INLINE_EDITING = True

# WYSIWYG Editor Configuration
CKEDITOR_SETTINGS = {
    'contentsCss': ['/static/css/components.css', '/static/css/base.css'],
    'allowedContent': True,
    'extraAllowedContent': '*[*]{*}',
}

# Wagtail Configuration
# WAGTAIL_SITE_NAME = 'Wizling'
# WAGTAILDOCS_EXTENSIONS = ['csv', 'docx', 'key', 'odt', 'pdf', 'pptx', 'rtf', 'txt', 'xlsx', 'zip']

# Security Configuration
X_FRAME_OPTIONS = 'SAMEORIGIN'
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'django.log'),
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
        },
        'wizling.signal_handler': {  # Logger for the signal handler
            'handlers': ['console', 'file'],
            'level': 'DEBUG',  # Log DEBUG level messages
            'propagate': False, # Prevents duplicate logging
        },
    },
}

LOGIN_URL = 'account_login'

# Authentication settings
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

SITE_ID = 1

# Auth settings
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'


# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp-relay.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'noreply@wizling.com'  # Change to noreply@
EMAIL_HOST_PASSWORD = os.getenv('GOOGLE_WORKSPACE_PASSWORD')

# Email addresses
DEFAULT_FROM_EMAIL = 'Wizling <noreply@wizling.com>'
SERVER_EMAIL = 'noreply@wizling.com'
SUPPORT_EMAIL = 'support@wizling.com'

# Django-allauth settings
ACCOUNT_EMAIL_SUBJECT_PREFIX = '[Wizling] '  # Optional: customize email subject
ACCOUNT_DEFAULT_HTTP_PROTOCOL = 'https'

# For local development
if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Remove these SendGrid-specific settings if they exist:
# SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
# SENDGRID_SANDBOX_MODE_IN_DEBUG = os.getenv('SENDGRID_SANDBOX_MODE_IN_DEBUG', 'True') == 'True'

# Add some debugging
print("DEBUG: SENDGRID_API_KEY present:", bool(os.getenv('SENDGRID_API_KEY')))
print("DEBUG: SENDGRID_SANDBOX_MODE_IN_DEBUG:", os.getenv('SENDGRID_SANDBOX_MODE_IN_DEBUG'))

if os.getenv('SENDGRID_API_KEY'):
    print("DEBUG: SENDGRID_API_KEY last 5 chars:", os.getenv('SENDGRID_API_KEY')[-5:])
else:
    print("DEBUG: SENDGRID_API_KEY is None or empty")
    