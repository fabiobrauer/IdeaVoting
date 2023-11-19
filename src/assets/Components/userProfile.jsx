import React from 'react';

function UserProfile() {
    // Retrieve user info from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    // Check if user info exists
    if (!user) {
        return <div>No user information available.</div>;
    }

    return (
        <div>
            <h2>User Profile</h2>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
}

export default UserProfile;
