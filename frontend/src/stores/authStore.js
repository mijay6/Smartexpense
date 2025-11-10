import  { create } from 'zustand';
import { authService } from '../services/authService';

const saveStorage = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

const clearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

const getErrorMessage = (error) => {

    if (error.response?.data) {
        return error.response.data.message || 
               error.response.data.error || 
               error.response.data.name ||
               error.response.statusText;
    }
    return error.message || 'An unexpected error occurred';
};


// this store will manage authentication state
export const useAuthStore = create((set) => ({

    // initial state
    user: null,
    token: null, 
    isAuthenticated: false,
    loading: false,
    error: null,
    isInitialized: false,

    register: async (data) => {
        try{
            set({ loading: true, error: null });

            const res = await authService.register(data);

            saveStorage(res.token, res.user);

            set({
                user: res.user,
                token: res.token,
                isAuthenticated: true,
                loading: false,
            });
        }
        catch (error){
            const errorMessage = getErrorMessage(error);
            set({
                error: errorMessage || 'Registration failed',
                loading: false
            });
            throw error;
        }
    },

    login: async (email, password) => { 

        try {
            // Doing login
            set({ loading: true, error: null });

            const res = await authService.login({ email, password });

            saveStorage(res.token,  res.user);

            set({
                user: res.user,
                token: res.token,
                isAuthenticated: true,
                loading: false,
            });

        } 
        catch(error) {
            const errorMessage = getErrorMessage(error);
            set({
                error: errorMessage || 'Login failed',
                loading: false
            });
            console.log(errorMessage);
            throw error;
        }
    },

    logout: () => {
        clearStorage();

        set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null
        });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        // If no token or user, set as unauthenticated
        if (!token || !user) {
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isInitialized: true,
            });
            return;
        }

        try { 
            // Validate token with backend and get updated user data
            const res = await authService.validateToken();

            // Update localStorage with fresh user data
            localStorage.setItem('user', JSON.stringify(res.user));

            // Token is valid, restore authentication state with updated user
            set({
                user: res.user,
                token: token,
                isAuthenticated: true,
                isInitialized: true,
            });
        }
        catch{
            // Token is invalid, clear everything
            clearStorage();

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isInitialized: true,
            });
        }
    }
}));

export default useAuthStore;