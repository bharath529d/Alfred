import subprocess
import os 

def store_subdomains(domain, subdomain_file_name):
    os.chdir(r'C:\Users\bhara\Downloads\RSUME\Python works\Alfred\Alfred\recon\tools')
    subprocess.call(['subfinder','-d',domain,'-o',fr'C:\Users\bhara\Downloads\RSUME\Python works\Alfred\Alfred\recon\tools_output\{subdomain_file_name}'])
    print("Got subdomains")

# import subprocess
# import tempfile
# import json
# import os

# # Create a temporary file
# with tempfile.NamedTemporaryFile(mode='w+', delete=False) as temp_file:
#     temp_filename = temp_file.name

#     # Run Subfinder command and direct output to temporary file
#     subprocess.run(
#         ['subfinder', '-d', 'rkmvc.ac.in', '-oJ', temp_filename]
#     )

# # Read the output from the temporary file
# with open(temp_filename, 'r') as file:
#     data = json.load(file)

# # Process the data
# for subdomain in data:
#     print(subdomain)

# # Delete the temporary file
# os.remove(temp_filename)
