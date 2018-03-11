import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ?
    'http://prog.keeleressursid.ee:5000/' :
    'http://localhost:5000/',
});

export default instance;
