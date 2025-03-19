import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [institutionCode, setInstitutionCode] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // Added for success message
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed. Check your credentials.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/accounts/signup/', {
                email,
                password1: password,
                password2: password,
                institution_code: institutionCode,
                role,
                birth_date: birthDate ? birthDate.toISOString().split('T')[0] : null,
            });
            setSuccess('Signup successful! Check your email to verify.'); // Use response
            setError('');
        } catch (err) {
            setError('Signup failed. Invalid institution code or email already exists.');
            setSuccess('');
        }
    };

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="row w-100">
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className="card shadow-lg p-4" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid #00ffcc', color: '#fff' }}>
                        <h2 className="text-center mb-4">{isSignup ? 'Sign Up' : 'Login'}</h2>
                        {error && <p className="text-danger text-center">{error}</p>}
                        {success && <p className="text-success text-center">{success}</p>} {/* Added success message */}
                        <form onSubmit={isSignup ? handleSignup : handleLogin}>
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
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {isSignup && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label">Role</label>
                                        <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                                            <option value="admin">Admin</option>
                                            <option value="teacher">Teacher</option>
                                            <option value="student">Student</option>
                                            <option value="parent">Parent</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Institution Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={institutionCode}
                                            onChange={(e) => setInstitutionCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Birth Date</label>
                                        <DatePicker
                                            selected={birthDate}
                                            onChange={(date) => setBirthDate(date)}
                                            className="form-control"
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Select your birth date"
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            <button type="submit" className="btn btn-primary w-100">
                                {isSignup ? 'Sign Up' : 'Login'}
                            </button>
                        </form>
                        <p className="text-center mt-3">
                            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button className="btn btn-link text-light" onClick={() => setIsSignup(!isSignup)}>
                                {isSignup ? 'Login' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <h1 className="display-4">Education ERP</h1>
                        <p className="lead">A 30th-century quantum learning ecosystem for schools.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
