import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/shared/LoadingSpinner'; 

export function Login(){

    const [email, setEmail] = useState('');  // is an state, is the memory of the component, when the state change, react re-render the component
    const [password, setPassword] = useState('');

    const [fieldErrors, setFieldErrors] = useState('');

    const { login, loading, error } = useAuthStore(); 
    
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!email.trim()) errors.email = 'Email is required';
        else if(!emailRegex.test(email)) errors.email = 'Please enter a valid email address';

        if(!password) errors.password = 'Password is required';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();                    // this prevent to refresh the page on submit
        setFieldErrors({});

        if (!validateForm()) return;

        try {
            await login(email, password);      // send to the backend
            navigate('/dashboard');            // redirect to dashboard after login
        }
        catch (error) {
            setEmail('');
            setPassword('');
            console.error(`Login failed ${error.message}`);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (fieldErrors.email) {
            setFieldErrors({ ...fieldErrors, email: '' });
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (fieldErrors.password) {
            setFieldErrors({ ...fieldErrors, password: '' });
        }
    };

    // render JSX
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100" >
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-800">
                        Expenso
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Log in into your acount    
                    </p>
                </div>
                {/* Backend error */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                        <svg 
                            className="w-5 h-5 shrink-0 mt-0.5" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                        <div className="flex-1">
                            <p className="font-medium mb-1">Login failed</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="your@email.com"
                            className= {`w-full px-4 py-3 border border-gray-300 rounded-lg 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                        placeholder:text-gray-400
                                        ${fieldErrors.email 
                                       ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                       : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                            autoComplete="email"
                        />
                        {fieldErrors.email && (
                            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>
                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className={`w-full px-4 py-3 border rounded-lg 
                                     focus:outline-none focus:ring-2 transition duration-200
                                     placeholder:text-gray-400
                                     ${fieldErrors.password 
                                       ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                       : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                            autoComplete="current-password"
                        />
                        {fieldErrors.password && (
                            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>
                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg 
                                 font-medium hover:bg-blue-700 
                                 disabled:bg-gray-400 disabled:cursor-not-allowed
                                 transform transition duration-200 
                                 hover:scale-[1.02] active:scale-[0.98]
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoadingSpinner size="xs" color="white" inline />
                                Logging in...
                            </span>
                        ) : (
                            'Log in'
                        )}
                    </button>
                </form>
                <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Do not have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Register here
                    </Link>
                </p>
                </div>
            </div>
        </div>
    );
}

export default Login;