import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Base URL for your backend API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;