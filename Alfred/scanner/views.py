from django.shortcuts import render
from .forms import TargetDetails
# Create your views here.
def home_page(request):
    tform = TargetDetails()
    return render(request,'home.html',{'form':tform})
