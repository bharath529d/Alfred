from django.db import models
import json
# Create your models here.
class Subdomains(models.Model):
    domain_name = models.TextField(primary_key=True)
    subdomains = models.TextField()

    def save_subdomains(self,subdomains):
        in_json_format = json.dumps(subdomains) 
        self.subdomains = in_json_format
        self.save()
        return in_json_format
        
    