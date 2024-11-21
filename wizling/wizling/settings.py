"""
Django settings for wizling project.
Environment-aware configuration supporting both local and Google Cloud deployment.
"""

import os
from pathlib import Path
from django.utils.translation import gettext_lazy as _
import logging
import sys

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

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
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

# FIX THESE FALLBACKS. DO WE NOT NEED SOCKETS?
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('CMS_DB', 'language_learning_cms'),
        'USER': os.getenv('DB_USER', 'cms_user'),
        'PASSWORD': os.getenv('DB_PASSWORD', os.getenv('CMS_DB_PASSWORD')),
        'HOST': os.getenv('DB_HOST', '127.0.0.1'),
        'PORT': os.getenv('DB_PORT', '3306'),
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci'
        }
    }
}

# Application definition
INSTALLED_APPS = [
    'wagtail.contrib.forms',
    'wagtail.contrib.redirects',
    'wagtail.embeds',
    'wagtail.sites',
    'wagtail.users',
    'wagtail.snippets',
    'wagtail.documents',
    'wagtail.images',
    'wagtail.search',
    'wagtail.admin',
    'wagtail',
    'modelcluster',
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
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'cms.middleware.user.CurrentUserMiddleware',
    'cms.middleware.page.CurrentPageMiddleware',
    'cms.middleware.toolbar.ToolbarMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'cms.middleware.language.LanguageCookieMiddleware',
    'wagtail.contrib.redirects.middleware.RedirectMiddleware',
]

# Static Files Configuration
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "wizling", "static"),
]

# Media Files Configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

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
WAGTAIL_SITE_NAME = 'Wizling'
WAGTAILDOCS_EXTENSIONS = ['csv', 'docx', 'key', 'odt', 'pdf', 'pptx', 'rtf', 'txt', 'xlsx', 'zip']

# Security Configuration
X_FRAME_OPTIONS = 'SAMEORIGIN'
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'stream': sys.stdout,
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
    },
}