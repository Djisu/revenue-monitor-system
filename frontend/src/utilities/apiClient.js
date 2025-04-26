import axios from 'axios';
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Create an Axios instance
var apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add a request interceptor to include the Authorization header
apiClient.interceptors.request.use(function (config) {
    var token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = "Bearer ".concat(token);
    }
    return config;
});
export default apiClient;
