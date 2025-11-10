import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';
import { CURRENCY_OPTIONS } from '../utils/currencyOptions';
import { COUNTRY_OPTIONS, getCountryName } from '../utils/countryOptions';

export function AdminPanel() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ page: 1, limit: 20, search: '' });
    const [searchInput, setSearchInput] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetailsLoading, setUserDetailsLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');
    const [newUserData, setNewUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: 'US',
        currency: 'USD'
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsData, usersData] = await Promise.all([
                adminService.getGlobalStats(),
                adminService.getAllUsers(filters)
            ]);
            setStats(statsData);
            setUsers(usersData.users);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    if (user?.role !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Change user role to ${newRole}?`)) return;
        
        try {
            await adminService.updateUserRole(userId, newRole);
            fetchData(); 
        } catch (error) {
            console.error('Failed to update role:', error);
            alert('Failed to update role');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await adminService.deleteUser(userId);
            setSelectedUser(null);
            fetchData(); 
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
        }
    };

    const handleViewDetails = async (userId) => {
        setUserDetailsLoading(true);
        try {
            const data = await adminService.getUserById(userId);
            setSelectedUser(data.user);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            alert('Failed to load user details');
        } finally {
            setUserDetailsLoading(false);
        }
    };

    const validateCreateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!newUserData.firstName.trim()) {
            errors.firstName = 'First name is required';
        } else if (newUserData.firstName.trim().length < 2) {
            errors.firstName = 'First name must be at least 2 characters';
        }

        if (!newUserData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        } else if (newUserData.lastName.trim().length < 2) {
            errors.lastName = 'Last name must be at least 2 characters';
        }

        if (!newUserData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(newUserData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!newUserData.password) {
            errors.password = 'Password is required';
        }

        if (!newUserData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (newUserData.password !== newUserData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreateError('');
        setFieldErrors({});

        if (!validateCreateForm()) return;

        setCreateLoading(true);
        try {
            await adminService.createUser({
                firstName: newUserData.firstName,
                lastName: newUserData.lastName,
                email: newUserData.email,
                password: newUserData.password,
                country: newUserData.country,
                currency: newUserData.currency
            });
            
            // Reset form and close modal
            setNewUserData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                country: 'US',
                currency: 'USD'
            });
            setShowCreateModal(false);
            fetchData(); // Refresh the users list
            alert('User created successfully!');
        } catch (error) {
            console.error('Failed to create user:', error);
            setCreateError(error.response?.data?.message || 'Failed to create user');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        setNewUserData(prev => ({
            ...prev,
            [name]: value
        }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    if (loading && !stats) {
        return <LoadingSpinner fullScreen>Loading admin panel...</LoadingSpinner>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>   
            {/* stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Users</h3>
                    <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Transactions</h3>
                    <p className="text-3xl font-bold">{stats?.totalTransactions || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Categories</h3>
                    <p className="text-3xl font-bold">{stats?.totalCategories || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Active Admins</h3>
                    <p className="text-3xl font-bold">
                        {users.filter(u => u.role === 'ADMIN').length}
                    </p>
                </div>
            </div>
            {/* Search Bar and Create Button */}
            <div className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                />
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create User
                </button>
            </div>
            {/* users table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transactions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(userItem => (
                            <tr key={userItem.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    {userItem.firstName} {userItem.lastName}
                                </td>
                                <td className="px-6 py-4">{userItem.email}</td>
                                <td className="px-6 py-4">{getCountryName(userItem.country)}</td>
                                <td className="px-6 py-4">{userItem.currency}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={userItem.role}
                                        onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                                        className="border rounded px-2 py-1"
                                        disabled={userItem.id === user?.id}
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleViewDetails(userItem.id)}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        {userItem._count?.expenses || 0} transactions
                                    </button>
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button
                                        onClick={() => handleDelete(userItem.id)}
                                        disabled={userItem.id === user?.id}
                                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b sticky top-0 bg-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </h2>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                    <div className="mt-2 flex gap-4 text-sm">
                                        <span className="text-gray-600">
                                            <strong>Country:</strong> {getCountryName(selectedUser.country)}
                                        </span>
                                        <span className="text-gray-600">
                                            <strong>Currency:</strong> {selectedUser.currency}
                                        </span>
                                        <span className="text-gray-600">
                                            <strong>Role:</strong> {selectedUser.role}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Transactions ({selectedUser.expenses?.length || 0})
                            </h3>
                            
                            {userDetailsLoading ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner>Loading transactions...</LoadingSpinner>
                                </div>
                            ) : selectedUser.expenses?.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedUser.expenses.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-2xl">{transaction.category.icon}</span>
                                                        <div>
                                                            <p className="font-medium">{transaction.description}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {transaction.category.name} • 
                                                                <span className={`ml-1 font-medium ${
                                                                    transaction.category.type === 'income' 
                                                                        ? 'text-green-600' 
                                                                        : transaction.category.type === 'expense'
                                                                        ? 'text-red-600'
                                                                        : 'text-blue-600'
                                                                }`}>
                                                                    {transaction.category.type.toUpperCase()}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {transaction.notes && (
                                                        <p className="text-sm text-gray-500 mt-2 ml-10">
                                                            📝 {transaction.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-lg font-bold ${
                                                        transaction.category.type === 'income' 
                                                            ? 'text-green-600' 
                                                            : 'text-red-600'
                                                    }`}>
                                                        {transaction.category.type === 'income' ? '+' : '-'}
                                                        {selectedUser.currency} {Number(transaction.amount).toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(transaction.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No transactions found</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b sticky top-0 bg-white">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Create New User</h2>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setNewUserData({
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            password: '',
                                            confirmPassword: '',
                                            country: 'US',
                                            currency: 'USD'
                                        });
                                        setFieldErrors({});
                                        setCreateError('');
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            {/* Backend error */}
                            {createError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">Failed to create user</p>
                                        <p className="text-sm">{createError}</p>
                                    </div>
                                </div>
                            )}
                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    value={newUserData.firstName}
                                    onChange={handleCreateInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                        fieldErrors.firstName 
                                            ? 'border-red-300 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {fieldErrors.firstName && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.firstName}</p>
                                )}
                            </div>
                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    value={newUserData.lastName}
                                    onChange={handleCreateInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                        fieldErrors.lastName 
                                            ? 'border-red-300 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {fieldErrors.lastName && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.lastName}</p>
                                )}
                            </div>
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={newUserData.email}
                                    onChange={handleCreateInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                        fieldErrors.email 
                                            ? 'border-red-300 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {fieldErrors.email && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
                                )}
                            </div>
                            {/* Country */}
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                </label>
                                <select
                                    id="country"
                                    name="country"
                                    value={newUserData.country}
                                    onChange={handleCreateInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {COUNTRY_OPTIONS.map(country => (
                                        <option key={country.value} value={country.value}>
                                            {country.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Currency */}
                            <div>
                                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                                    Currency
                                </label>
                                <select
                                    id="currency"
                                    name="currency"
                                    value={newUserData.currency}
                                    onChange={handleCreateInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {CURRENCY_OPTIONS.map(currency => (
                                        <option key={currency.value} value={currency.value}>
                                            {currency.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={newUserData.password}
                                    onChange={handleCreateInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                        fieldErrors.password 
                                            ? 'border-red-300 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {!fieldErrors.password && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                                    </p>
                                )}
                                {fieldErrors.password && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
                                )}
                            </div>
                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    value={newUserData.confirmPassword}
                                    onChange={handleCreateInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                        fieldErrors.confirmPassword 
                                            ? 'border-red-300 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {fieldErrors.confirmPassword && (
                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                                )}
                            </div>
                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setNewUserData({
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            password: '',
                                            confirmPassword: '',
                                            country: 'US',
                                            currency: 'USD'
                                        });
                                        setFieldErrors({});
                                        setCreateError('');
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                >
                                    {createLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <LoadingSpinner size="xs" color="white" inline />
                                            Creating...
                                        </span>
                                    ) : (
                                        'Create User'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;