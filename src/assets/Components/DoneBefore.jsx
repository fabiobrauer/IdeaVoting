import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoneBeforeButton({ postId }) {
    const [count, setCount] = useState(0);
    const [doneBefore, setDoneBefore] = useState(false);

    // Function to fetch the post data
    const fetchPost = async () => {
        try {
            const response = await axios.get(`https://idea-voting-387db496fe7a.herokuapp.com/posts/${postId}/doneBefore`);
            const userId = localStorage.getItem('userId'); // Replace with your user ID retrieval logic
            setCount(response.data.doneBefore.length);
            setDoneBefore(response.data.doneBefore.includes(userId));
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    // Fetch post data on component mount
    useEffect(() => {
        fetchPost();
    }, [postId]);

    const toggleDoneBefore = async () => {
        const isLoggedIn = localStorage.getItem('token'); 
       
        if (!isLoggedIn) {
            alert('You must be logged in to mark as "Done Before"!');
            return;
        }

        try {
            let response;
            if (doneBefore) {
                // Send request to mark as not done before
                response = await axios.delete(`https://idea-voting-387db496fe7a.herokuapp.com/posts/${postId}/doneBefore`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                // Send request to mark as done before
                response = await axios.patch(`https://idea-voting-387db496fe7a.herokuapp.com/posts/${postId}/doneBefore`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            setCount(response.data.doneBefore.length);
            setDoneBefore(!doneBefore);
        } catch (error) {
            console.error('Error toggling "Done Before":', error);
        }
    };

    return (
        <button onClick={toggleDoneBefore}>{count} Done Before</button>
    );
}

export default DoneBeforeButton;
