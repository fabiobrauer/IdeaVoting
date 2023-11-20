// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'

function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://idea-voting-387db496fe7a.herokuapp.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            console.log('Login Success:', data);
            if (response.status === 200) {
              // Handle login success
              console.log('Login Success');
              localStorage.setItem('token', data.accessToken);
              localStorage.setItem('user', JSON.stringify(data.user));
              // Redirect to another route, e.g., '/'
              navigate('/'); 
          } else {
              // Handle login error
              console.error('Login Error');
          }
            // Handle login success (e.g., store auth token, redirect to dashboard)
        } catch (error) {
            console.error('Login Error:', error);
            // Handle login error (e.g., show error message)
        }
    };

    return (
        <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
            />

            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
            />

            <button type="submit">Login</button>
        </form>
    </div>
    );
}

export default Login;
