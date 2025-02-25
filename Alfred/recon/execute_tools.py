import subprocess
import os 

def store_subdomains(domain, subdomain_file_name):
    os.chdir(r'C:\Users\bhara\Downloads\RSUME\Python works\Alfred\Alfred\recon\tools')
    subprocess.call(['subfinder','-d',domain,'-o',fr'C:\Users\bhara\Downloads\RSUME\Python works\Alfred\Alfred\recon\tools_output\{subdomain_file_name}'])
    print("Got subdomains")