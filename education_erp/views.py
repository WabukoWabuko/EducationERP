from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from education_erp.models import EducationUser, Student, Attendance
import logging
from django.utils import timezone

logger = logging.getLogger(__name__)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, username=email, password=password)
        if user is None:
            logger.error(f"Login failed for email: {email}")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        token, created = Token.objects.get_or_create(user=user)
        logger.info(f"User {email} logged in successfully")
        return Response({
            'token': token.key,
            'role': user.role
        }, status=status.HTTP_200_OK)

class StudentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'admin':
            students = Student.objects.all()
            data = [{'id': s.id, 'name': s.name, 'enrollment_date': s.enrollment_date} for s in students]
        elif user.role == 'student':
            student = Student.objects.get(user=user)
            data = [{'id': student.id, 'name': student.name, 'enrollment_date': student.enrollment_date}]
        elif user.role == 'parent':
            students = Student.objects.filter(user__parent=user)
            data = [{'id': s.id, 'name': s.name, 'enrollment_date': s.enrollment_date} for s in students]
        else:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        # Add attendance data
        for student_data in data:
            attendance = Attendance.objects.filter(student__id=student_data['id'])
            student_data['attendance'] = [{'date': a.date, 'present': a.present} for a in attendance]

        return Response(data)

    def post(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        name = request.data.get('name')
        email = request.data.get('email')
        enrollment_date = request.data.get('enrollment_date')
        parent_email = request.data.get('parent_email')

        # Create user for student
        user = EducationUser.objects.create_user(
            email=email,
            password='defaultpassword123',  # Change in production
            role='student',
            institution_code=request.user.institution_code
        )
        parent = EducationUser.objects.filter(email=parent_email, role='parent').first()
        if parent:
            user.parent = parent
            user.save()

        # Create student
        student = Student.objects.create(user=user, name=name, enrollment_date=enrollment_date)

        # Add attendance
        Attendance.objects.create(student=student, date=timezone.now(), present=True)

        return Response({'id': student.id, 'name': student.name, 'enrollment_date': student.enrollment_date})
