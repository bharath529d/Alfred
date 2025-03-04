import os, json, subprocess
from .models import Subdomains
import builtwith
def store_subdomains(domain):
    os.chdir(r'C:\Users\bhara\Downloads\RSUME\Python works\Alfred\Alfred\recon\tools')
    command = f"subfinder -d {domain}"
    result = subprocess.run(command,shell=True,capture_output=True,text=True)
    subdomains = []
    subdomain = []
    for ch in result.stdout:  # converting the output of the command into a list of subdomains
        if ch != "\n": 
            subdomain.append(ch)
        else:
            subdomains.append(''.join(subdomain))
            subdomain = []
    new_domain = Subdomains() # creating a new record of Subdomains
    new_domain.domain_name = domain  # setting the domain_name to the domain for which subdomains were requested
    return new_domain.save_subdomains(subdomains) # stores the subdomains in json format and
    # returns the json formatted string of subdomains

def tech_stack_list(subdomains):
    tech_stack = []
    for subdomain in subdomains:
        result = builtwith.parse(f"https://{subdomain}")
        tech_stack.append({subdomain:result})
    return tech_stack
