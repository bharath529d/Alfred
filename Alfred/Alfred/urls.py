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
from recon.views import run_katana, run_subfinder, run_gau, run_sqlmap
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('recon/', views),  #include recon tools 
    path("katana/", run_katana, name="run_katana"),
    path("subfinder/", run_subfinder, name="run_subfinder"),
    path("gau/", run_gau, name="run_gau"),
    path("sqlmap/", run_sqlmap, name="run_sqlmap"),
]
