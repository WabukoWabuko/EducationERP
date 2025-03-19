from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class EducationUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('parent', 'Parent'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    institution_code = models.CharField(max_length=50, blank=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'role': 'parent'})

    def __str__(self):
        return self.email

class Student(models.Model):
    user = models.OneToOneField(EducationUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    name = models.CharField(max_length=100)
    enrollment_date = models.DateField(default=timezone.now)

    def __str__(self):
        return self.name

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    present = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.student.name} - {self.date}"
