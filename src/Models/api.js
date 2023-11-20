import axios from 'axios';

// Base URL determination based on the environment
const BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' // Use your development URL
    : 'https://idea-voting-387db496fe7a.herokuapp.com'; // Use your production URL

// Function to create an instance of axios with the base URL
const api = axios.create({
    baseURL: BASE_URL,
});

// Exportable functions for different API requests
export const fetchPost = async (postId) => {
    try {
        const response = await api.get(`/posts/${postId}/like`);
        return response.data;
    } catch (error) {
        // Handle errors
        console.error(error);
    }
}

// Add more functions as needed for other API requests
