// Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css'


function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://idea-voting-387db496fe7a.herokuapp.com/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log('Success:', data);
            setFormData({
              name: '',
              password: ''
          });
          navigate('/login');
            // Handle success (e.g., show message, redirect)
        } catch (error) {
            console.error('Error:', error);
            // Handle error
        }
    };

    return (
        <div className="register-form-container">
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Register</h2>

            <label htmlFor="name">name:</label>
            <input
                type="name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <button type="submit">Register</button>
        </form>
    </div>
    );
}

export default Register;
