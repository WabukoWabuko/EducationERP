import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [enrollmentDate, setEnrollmentDate] = useState(new Date());
    const [error, setError] = useState('');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/auth/students/', {
                    headers: { Authorization: `Token ${localStorage.getItem('token')}` },
                });
                setStudents(response.data);
            } catch (err) {
                setError('Failed to load students.');
            }
        };
        fetchStudents();
    }, []);

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/auth/students/',
                {
                    name,
                    email,
                    parent_email: parentEmail,
                    enrollment_date: enrollmentDate.toISOString().split('T')[0],
                },
                { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
            );
            setStudents([...students, response.data]);
            setName('');
            setEmail('');
            setParentEmail('');
            setEnrollmentDate(new Date());
        } catch (err) {
            setError('Failed to add student.');
        }
    };

    const getAttendanceChartData = (attendance) => {
        const present = attendance.filter(a => a.present).length;
        const absent = attendance.length - present;
        return {
            labels: ['Present', 'Absent'],
            datasets: [
                {
                    data: [present, absent],
                    backgroundColor: ['#00ffcc', '#ff3366'],
                    borderColor: ['#00ffcc', '#ff3366'],
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <div className="container-fluid py-5">
            <h1 className="display-4 text-center mb-4">Student Management</h1>
            {error && <p className="text-danger text-center">{error}</p>}
            {role === 'admin' && (
                <div className="card shadow-lg p-4 mb-4" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid #00ffcc' }}>
                    <h3>Add Student</h3>
                    <form onSubmit={handleAddStudent}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Parent Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={parentEmail}
                                onChange={(e) => setParentEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Enrollment Date</label>
                            <DatePicker
                                selected={enrollmentDate}
                                onChange={(date) => setEnrollmentDate(date)}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select enrollment date"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Add Student</button>
                    </form>
                </div>
            )}
            <div className="row">
                {students.map(student => (
                    <div key={student.id} className="col-md-4 mb-4">
                        <div className="card shadow-lg p-4" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid #00ffcc' }}>
                            <h5>{student.name}</h5>
                            <p>Enrolled: {student.enrollment_date}</p>
                            <h6>Attendance</h6>
                            <div style={{ width: '200px', height: '200px', margin: '0 auto' }}>
                                <Pie data={getAttendanceChartData(student.attendance)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentManagement;
