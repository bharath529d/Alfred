"""
URL configuration for Alfred project.

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
from django.contrib import admin
from django.urls import path
from django.urls import path
from recon import views
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.recon_page), 
    path("katana/", views.run_katana, name="run_katana"),
    path("subfinder/", views.run_subfinder, name="run_subfinder"),
    path("gau/", views.run_gau, name="run_gau"),
    path("sqlmap/", views.run_sqlmap, name="run_sqlmap"),
    path('getip/',views.get_resolved_ip),
    path('getsubdomains/',views.get_subdomains),
    path('dummy/',views.dummy_page),
    path('tech_stack/',views.get_tech_stack),
    path('crawling_results/',views.get_crawling_results)
]
