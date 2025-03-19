import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const role = localStorage.getItem('role');

    return (
        <div className="container-fluid py-5">
            <h1 className="display-4 text-center mb-4">Welcome to Education ERP, {role}!</h1>
            <div className="text-center">
                {(role === 'admin' || role === 'student' || role === 'parent') && (
                    <Link to="/students" className="btn btn-primary m-2">Student Management</Link>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
