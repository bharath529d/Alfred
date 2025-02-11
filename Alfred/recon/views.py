from django.shortcuts import render
import subprocess
import json
from django.http import JsonResponse
# Create your views here.


def run_katana(request):
    target = request.GET.get("domain", "")
    if not target:
        return JsonResponse({"error": "No domain provided"}, status=400)
    
    try:
        result = subprocess.run(["katana", "-u", target], capture_output=True, text=True)
        urls = result.stdout.split("\n")
        return JsonResponse({"urls": urls})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def run_subfinder(request):
    target = request.GET.get("domain", "")
    if not target:
        return JsonResponse({"error": "No domain provided"}, status=400)

    try:
        result = subprocess.run(["subfinder", "-d", target], capture_output=True, text=True)
        subdomains = result.stdout.split("\n")
        return JsonResponse({"subdomains": subdomains})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def run_gau(request):
    target = request.GET.get("domain", "")
    if not target:
        return JsonResponse({"error": "No domain provided"}, status=400)

    try:
        result = subprocess.run(["gau", target], capture_output=True, text=True)
        urls = result.stdout.split("\n")
        return JsonResponse({"urls": urls})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def run_sqlmap(request):
    target = request.GET.get("url", "")
    if not target:
        return JsonResponse({"error": "No URL provided"}, status=400)

    try:
        result = subprocess.run(["sqlmap", "-u", target, "--batch"], capture_output=True, text=True)
        return JsonResponse({"output": result.stdout})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
