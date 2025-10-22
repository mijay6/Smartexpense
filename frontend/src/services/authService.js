import api from './api';

// Centralize all authentication-related logic
export const authService = {

    // register a new user
    async register(data){
        const res = await api.post('/auth/register', data);
        return res.data;
        // If the request fails, an error will be thrown and the component can catch it
    },

    async login(data){
        const res =  await api.post('/auth/login', data);
        return res.data;
    },

    async validateToken(){
        const res = await api.get('/auth/validate');
        return res.data;       
    },

    // TODO: implement refresh token logic

};

export default authService;