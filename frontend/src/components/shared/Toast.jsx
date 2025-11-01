import { useEffect } from 'react';

export function Toast({ message, type = 'error', onClose, duration = 5000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = {
        error: 'bg-red-50 border-red-500 text-red-800',
        success: 'bg-green-50 border-green-500 text-green-800',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
        info: 'bg-blue-50 border-blue-500 text-blue-800',
    };

    const icons = {
        error: '❌',
        success: '✅',
        warning: '⚠️',
        info: 'ℹ️',
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 max-w-md w-full border-l-4 p-4 rounded-lg shadow-lg ${typeStyles[type]} animate-slide-in`}
            role="alert"
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{icons[type]}</span>
                <div className="flex-1">
                    <p className="font-medium">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default Toast;
