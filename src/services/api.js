import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
