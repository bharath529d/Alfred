from django.shortcuts import render
import subprocess
import json
from django.http import JsonResponse
import icmplib
import os
import subprocess
from .import execute_tools
from .models import Subdomains
from django.views.decorators.csrf import csrf_exempt
import socket
import httpx

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

def recon_page(request):
    return render(request,'main.html')

def dummy_page(request):
    return render(request,'dummy.html')

# def resolve_ip(request):
#     domain = request.POST['domain']
#     ip = icmplib.resolve(domain, family=6)
#     print(ip)
#     result = icmplib.ping(ip[0],count=2,interval=1,timeout=2)
#     if result.packets_sent == result.packet_loss:
#         message = "Not Reachable"
#     else:
#         message = "Reachable"
#     return render(request,'home.html',{'domain':domain,'ip': ip[0],'message':message})

"""
def get_resolved_ip(request):
    try:
        domain = request.GET.get('domain')
        ipv4 = icmplib.resolve(domain,family=4)
        ipv6 = icmplib.resolve(domain,family=6)
        result = icmplib.ping(ipv4[0],count=2,interval=1,timeout=2)
        if not result.is_alive:
            return JsonResponse({"err_mes":"Domain isn't Alive","success":False})
        data = {"ipv4":ipv4[0],"ipv6":ipv6[0],"success":True}
        return JsonResponse(data)
    except Exception as e:
        print("error: ",e)
        return JsonResponse({"err_mes":"Domain doesn't exists","success":False})
"""

def get_resolved_ip(request):
    try:
        domain = request.GET.get('domain')

        # Resolve IPv4 and IPv6 using `socket.getaddrinfo()`
        ipv4 = socket.getaddrinfo(domain, None, socket.AF_INET)[0][4][0]
        ipv6 = socket.getaddrinfo(domain, None, socket.AF_INET6)[0][4][0]

        # Use system ping command (cross-platform support)
        def is_alive(ip):
            try:
                # "-c 1" for Linux/macOS, "-n 1" for Windows
                ping_cmd = ["ping", "-c", "1", ip] if subprocess.run(["uname"], capture_output=True).returncode == 0 else ["ping", "-n", "1", ip]
                result = subprocess.run(ping_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                return result.returncode == 0  # If return code is 0, host is alive
            except Exception:
                return False

        # Check if the resolved IPv4 is alive
        if not is_alive(ipv4):
            return JsonResponse({"err_mes": "Domain isn't Alive", "success": False})

        data = {"ipv4": ipv4, "ipv6": ipv6, "success": True}
        return JsonResponse(data)

    except Exception as e:
        print("error:", e)
        return JsonResponse({"err_mes": "Domain doesn't exist", "success": False})

"""
def get_subdomains(request):
    domain = request.GET.get('domain')
    result = Subdomains.objects.filter(domain_name=f"{domain}")
    reachable = []
    subdomains = []
    if len(result):
        subdomains =  json.loads(result[0].subdomains)
    else:
        subdomains = json.loads(execute_tools.store_subdomains(domain))
    
    for subdomain in subdomains:
        try:
            result = icmplib.ping(subdomain,count=1,interval=0,timeout=2)
            reachable.append(True) if result.is_alive else reachable.append(False)
        except:
            reachable.append(False)
    return JsonResponse({"subdomains":subdomains,"reachable":reachable,"message": "Subdomains Fetched Succesfully.."})
"""




def is_reachable(subdomain):
    try:
        response = httpx.get(f"http://{subdomain}", timeout=2)
        return response.status_code < 400  # Consider it reachable if status is 200-399
    except httpx.RequestError:
        return False

def get_subdomains(request):
    domain = request.GET.get('domain')
    if not domain:
        return JsonResponse({"error": "Domain parameter is required"}, status=400)

    result = Subdomains.objects.filter(domain_name=domain)
    
    if result.exists():
        subdomains = json.loads(result.first().subdomains)
    else:
        subdomains = json.loads(execute_tools.store_subdomains(domain))

    reachable = [is_reachable(subdomain) for subdomain in subdomains]

    return JsonResponse({
        "subdomains": subdomains,
        "reachable": reachable,
        "message": "Subdomains Fetched Successfully."
    })



@csrf_exempt
def get_tech_stack(request):
    if request.method == "POST":
        subdomains = json.loads(request.body)
        tech_stack = execute_tools.tech_stack_list(subdomains)
        print(tech_stack, type(tech_stack))
    return JsonResponse({"tech_stack": tech_stack})

@csrf_exempt
def get_crawling_results(request):
    if request.method == "POST":
        subdomains = json.loads(request.body)
        c_result = execute_tools.crawling_results(subdomains)
        print()
        print({"crawling_results":c_result})
        return JsonResponse({"crawling_results":c_result}) # {"cr":[]}



