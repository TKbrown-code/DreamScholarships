import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const fetchScholarships = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/scholarships`);
        return response.data;
    } catch (error) {
        console.error('Error fetching scholarships:', error);
        throw error;
    }
};

export const applyForScholarship = async (applicationData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/apply`, applicationData);
        return response.data;
    } catch (error) {
        console.error('Error applying for scholarship:', error);
        throw error;
    }
};

// Add more API functions as needed