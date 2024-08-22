// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

const Login = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const user = {
            mobileNumber,
            password,
            role: 'Admin'
        };

        try {
            const response = await axios.post('http://localhost:8088/admin/login', user);
            if (response.status === 200) {
                console.log("Successfully Log In");

                // Store user data and key in local storage
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('key', response.data.key);

                // Log the stored user data and key
                const storedUser = localStorage.getItem('user');
                const storedKey = localStorage.getItem('key');
                console.log("Stored user data:", JSON.parse(storedUser));
                console.log("Stored key:", storedKey);

                navigate('/dashboard');
            }
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Mobile Number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? <div className="spinner"></div> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
