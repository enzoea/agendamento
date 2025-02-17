import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.100.3:3000', // Altere para o IP do seu backend
});

export default api;
