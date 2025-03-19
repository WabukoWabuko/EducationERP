from django import forms
from allauth.account.forms import SignupForm
from education_erp.models import EducationUser

class InstitutionSignupForm(SignupForm):
    institution_code = forms.CharField(max_length=50, required=True)
    role = forms.ChoiceField(choices=EducationUser.ROLE_CHOICES, required=True)

    def save(self, request):
        # Hardcode institution code for now (replace with a proper system in production)
        valid_code = "INST123"  # Only users with this code can sign up
        if self.cleaned_data['institution_code'] != valid_code:
            raise forms.ValidationError("Invalid institution code. You must be part of the institution to sign up.")
        
        user = super(InstitutionSignupForm, self).save(request)
        user.institution_code = self.cleaned_data['institution_code']
        user.role = self.cleaned_data['role']
        user.save()
        return user
