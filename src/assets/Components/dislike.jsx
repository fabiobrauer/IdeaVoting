import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dislike.css'

function DislikeButton({ postId }) {
    const [count, setCount] = useState(0);
    const [disliked, setDisliked] = useState(false);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`https://idea-voting-387db496fe7a.herokuapp.com/posts/${postId}/dislike`/* `http://localhost:3000/posts/${postId}/dislike` */);
            const userId = localStorage.getItem('userId'); // Replace with your user ID retrieval logic
            setCount(response.data.dislike.length);
            setDisliked(response.data.dislike.includes(userId));
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const toggleDislike = async () => {
        const isLoggedIn = localStorage.getItem('token');
       
        if (!isLoggedIn) {
            alert('You must be logged in to dislike!');
            return;
        }

        try {
            let response;
            if (disliked) {
                response = await axios.delete(`https://idea-voting-387db496fe7a.herokuapp.com/posts/${postId}/dislike`/* `http://localhost:3000/posts/${postId}/dislike` */, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                response = await axios.patch(`https://idea-voting-387db496fe7a.herokuapp.com/posts/${postId}/dislike`/* `http://localhost:3000/posts/${postId}/dislike` */, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            setCount(response.data.dislike.length);
            setDisliked(!disliked);
        } catch (error) {
            console.error('Error toggling dislike:', error);
        }
    };

    return (
        <button onClick={toggleDislike} className='button'>{count} Dislike</button>
    );
}

export default DislikeButton;
