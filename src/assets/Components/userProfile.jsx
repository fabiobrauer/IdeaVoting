import React from 'react';
import './userProfile.css'
import LogoutButton from './Logout'

function UserProfile() {
    // Retrieve user info from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    // Check if user info exists
    if (!user) {
        return <div className="user-profile">No user information available.</div>;
    }

    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <LogoutButton/>
        </div>
    );
}

export default UserProfile;
