import { create } from 'zustand';

export const useToast = create((set) => ({
    toasts: [],
    
    addToast: (message, type = 'error') => {
        const id = Date.now();
        set((state) => ({
            toasts: [...state.toasts, { id, message, type }]
        }));
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter(toast => toast.id !== id)
            }));
        }, 5000);
    },
    
    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter(toast => toast.id !== id)
        }));
    },
    
    clearToasts: () => {
        set({ toasts: [] });
    }
}));

export default useToast;
