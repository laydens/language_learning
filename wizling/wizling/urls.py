"""
URL configuration for wizling project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.i18n import JavaScriptCatalog
from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls
from . import views

urlpatterns = [
    # path('', TemplateView.as_view(template_name='home.html'), name='home'),  # Home page view
    path('api/', include('api.urls')),  # Include API URLs under the 'api/' prefix
    path('admin/', admin.site.urls),  # Admin interface
    path('card-study/', views.render_flashcard_game, name='flashcard_game'),
    path('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
    path('filer/', include('filer.urls')),
    path('', include('cms.urls')),
    path('a/', include(wagtailadmin_urls)),
    path('d/', include(wagtaildocs_urls)),
    path('p/', include(wagtail_urls))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)