import os, json, subprocess
from .models import Subdomains
from wappalyzer import analyze # type: ignore
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

def tech_stack_dict(subdomains):
    tech_stack = dict()
    for subdomain in subdomains:
        url = f'https://{subdomain}'
        result = analyze(url)
        json_dict = result[url]
        cate = []
        technology = []
        version = []
        for key, value in json_dict.items():
            cate.append(value['categories'])
            technology.append(key)
            version.append(version)
        tech_stack[subdomain] = {"category":cate,"tech":technology,"version":version}
    return tech_stack
