from django import forms

class TargetDetails(forms.Form):
    target_domain = forms.CharField(label="Target Domain")