import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LikeButton from './Like';
import DoneBeforeButton from './DoneBefore';
import DislikeButton from './dislike';
import './post2.css'

const PostComponent = () => {
    const [newPost, setNewPost] = useState('');
    const [posts, setPosts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                console.log("code executed");
                const response = await axios.get('https://idea-voting-387db496fe7a.herokuapp.com/posts'/* 'http://localhost:3000/posts' */);
                console.log("Response data:", response.data);
                const sortedPosts = response.data.sort((a, b) => b.like.length - a.like.length);
                setPosts(sortedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
    
        fetchPosts();
        checkLoggedIn();
    }, []);

    const checkLoggedIn = () => {
        // Check if the user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    };

    const submitPost = async () => {
        if (!isLoggedIn) {
            alert('You must be logged in to post!');
            return;
        }

        if (newPost.trim() !== '') {
            try {
                const response = await axios.post('https://idea-voting-387db496fe7a.herokuapp.com/posts'/* 'http://localhost:3000/posts' */, {
                    content: newPost,
                    // other post data
                });
                setPosts([...posts, response.data]);
                setNewPost(''); // Clear the input field after submission
            } catch (error) {
                console.error('Error posting data:', error);
            }
        }
    };

    const handleLikeChange = (postId, newLikeCount) => {
        setPosts(currentPosts => {
            return currentPosts.map(post => {
                if (post._id === postId) {
                    return { ...post, like: Array(newLikeCount).fill(null) }; // Assuming 'like' is an array
                }
                return post;
            }).sort((a, b) => b.like.length - a.like.length);
        });
    };

    return (
        <div className="post-container">
    {isLoggedIn && (
        <div className="post-submission">
            <input 
                className="input-field"
                type="text" 
                value={newPost} 
                onChange={(e) => setNewPost(e.target.value)} 
            />
            <button className="button" onClick={submitPost}>Post</button>
        </div>
    )}
    {!isLoggedIn && <p className="login-message">Please log in to post.</p>}
    <div>
        {posts.map(post => (
            <div key={post._id} className="post">
                <p className="post-content">{post.content}</p>
                <LikeButton  postId={post._id} onLikeChange={(newCount) => handleLikeChange(post._id, newCount)}></LikeButton>
                <DoneBeforeButton postId={post._id}></DoneBeforeButton>
                <DislikeButton postId={post._id}></DislikeButton>
            </div>
        ))}
    </div>
</div>

    );
};

export default PostComponent;
