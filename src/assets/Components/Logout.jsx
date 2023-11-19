import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user data from local storage or any state management you are using
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login page or home page
        navigate('/login');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;