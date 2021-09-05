import Axios from 'axios';

const instance = Axios.create({
    baseURL: 'http://localhost:8002/api/syllabus'
});

instance.defaults.headers.common['Authorization'] = window.sessionStorage.getItem("token");

export default instance;