import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';

function App() {
    return (
        <BrowserRouter>
            <div className="container-fluid p-0" style={{ background: 'linear-gradient(45deg, #0f0c29, #302b63, #24243e)', minHeight: '100vh', color: '#fff' }}>
                <Routes>
                    <Route path="/*" element={<LoginPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/students" element={<StudentManagement />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
