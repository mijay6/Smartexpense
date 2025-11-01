import { authStore } from '../stores/authStore';
import { useNavigate, Link } from 'react-router-dom';

export function Dashboard(){

    const { user, logout } = authStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // render JSX
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Expenso</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-700">
                    Hello, {user?.firstName}!
                    </span>
                    <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                    Log Out
                    </button>
                </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                {/*Nav butons*/}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                        onClick={() => navigate('/expenses')} 
                        className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow" 
                    >
                        <div className="text-4xl mb-2">💸</div>
                        <h3 className="text-lg font-semibold">Expenses</h3>
                        <p className="text-sm text-gray-600">Manage your Expenses</p>
                    </button>
                    <div className="bg-white p-6 rounded-lg shadow opacity-50">
                        <div className="text-4xl mb-2">💰</div>
                        <h3 className="font-semibold">Income</h3>
                        <p className="text-sm text-gray-600">Coming soon...</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow opacity-50">
                        <div className="text-4xl mb-2">🏦</div>
                        <h3 className="font-semibold">Savings</h3>
                        <p className="text-sm text-gray-600">Coming soon...</p>
                    </div>    
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600">
                    Welcome to Expenso! 
                </p>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;