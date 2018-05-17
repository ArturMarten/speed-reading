import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ?
    'https://kiirlugemine.keeleressursid.ee/api/' :
    'http://localhost:5000/',
});

export default instance;
