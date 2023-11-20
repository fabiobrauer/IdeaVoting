import React, { useState, useEffect } from 'react';
import axios from 'axios';
/* import { fetchPost } from '../../Models/api'; */ // Importing from the api module

function LikeButton({ postId, onLikeChange}) {
    const [count, setCount] = useState(0);
    const [liked, setLiked] = useState(false);

    const fetchPost = async () => {
        try {
            // Updated URL to include '/like' at the end
            const response = await axios.get(`https://idea-voting-387db496fe7a.herokuapp.com/posts/${postId}/like` /* `http://localhost:3000/posts/${postId}/like` */);
            setCount(response.data.like.length);
            // Assuming the user ID is stored in local storage or a similar place
            const userId = localStorage.getItem('userId'); 
            setLiked(response.data.like.includes(userId));
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };
    

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const toggleLike = async () => {
        const isLoggedIn = localStorage.getItem('token'); 
        if (!isLoggedIn) {
            alert('You must be logged in to like a post!');
            return;
        }

        try {
            let response;
            if (liked) {
                // Send request to unlike the post
                response = await axios.delete(`https://idea-voting-387db496fe7a.herokuapp.com/posts/${postId}/like`/* `http://localhost:3000/posts/${postId}/like` */ , {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                // Send request to like the post
                response = await axios.patch(`https://idea-voting-387db496fe7a.herokuapp.com/posts/${postId}/like`/* `http://localhost:3000/posts/${postId}/like` */ , {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            setCount(response.data.like.length); // Update the like count
            setLiked(!liked); // Toggle the liked state
            if (onLikeChange) {
                onLikeChange(response.data.like.length);
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };

    return (
        <button onClick={toggleLike}>{count} Like</button>
    );
}

export default LikeButton;
