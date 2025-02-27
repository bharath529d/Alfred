from django.db import models
import json
# Create your models here.
class Subdomains(models.Model):
    domain_name = models.TextField(primary_key=True)
    subdomains = models.TextField()

    def save_subdomains(self,subdomains):
        self.subdomains = json.dumps(subdomains) 
        self.save()
    
    def get_subdomains(self, subdomains):
        return json.loads(self.subdomains)
    