import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ?
    'https://kiirlugemine.keeleressursid.ee/api/' :
    'http://127.0.0.1:5000/api/',
});

export default instance;
