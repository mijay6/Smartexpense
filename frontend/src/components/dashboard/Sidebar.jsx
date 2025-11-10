// TODO: Move Sidebar to shared components

import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Separator } from '../dashboard/Separator';
import {
    LayoutDashboard,
    CreditCard,
    TrendingUp,
    PiggyBank,
    Wallet,
    Target,
    BarChart3,
    Settings,
    LogOut,
    HelpCircle
} from 'lucide-react';


export function Sidebar({ activeTab, setActiveTab }) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'expenses', label: 'Expenses', icon: CreditCard },
        { id: 'incomes', label: 'Incomes', icon: TrendingUp },
        { id: 'savings', label: 'Savings', icon: PiggyBank },
        { id: 'budgets', label: 'Budgets', icon: Wallet},
        { id: 'goals', label: 'Goals', icon: Target},
        { id: 'reports', label: 'Reports', icon: BarChart3},
        { id: 'settings', label: 'Settings', icon: Settings},
    ];

    const handleLogout = () =>{
        logout();
        navigate('/login')
    };

    const handleNavigation = (itemId) => {
        setActiveTab(itemId);

        if(itemId === 'dashboard'){
            navigate('/dashboard');
        } else if (itemId === 'expenses'){
            navigate('/expenses');
        } else if (itemId === 'incomes'){
            navigate('/incomes');
        } // Add more navigation as needed
    };

    return (
        <div className="flex flex-col h-screen w-52 p-3" style={{ backgroundColor: '#1e293b' }}>
            {/*logo*/}
            <div className="flex items-center gap-3 px-2 mb-6">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">E</span> {/*TODO: Search and puta svg logo*/}
                </div>
                <h2 className="text-white text-lg font-bold">Expenso</h2>
            </div>
            {/*user profile*/}
            <div className="flex items-center gap-2 p-2 rounded-lg mb-4 cursor-pointer transition-all duration-300"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
            >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}  {/*TODO: Here will go the user picture*/}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sx text-white truncate">
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-gray-400 truncate" style={{ fontSize: '10px' }}>
                        {user?.email}
                    </p>
                </div>
            </div>

            <Separator  className="mb-4"/>

            {/* navigation*/}
            <nav className="flex-1 space-y-1 overflow-y-auto">
                {menuItems.map((item)=>{
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            style={isActive ? { backgroundColor: '#3b82f6' } : {}}
                            className={`w-full flex items-center justify-start gap-2 px-3 py-2 rounded-lg transition-colors text-sm h-9 group cursor-pointer ${
                                isActive 
                                ? "text-white hover:bg-blue-600 hover:text-black" 
                                : "text-gray-300 hover:text-gray-200 hover:bg-white/5"
                            }`}
                        >
                            <Icon className={`h-4 w-4 transition-colors ${isActive ? 'group-hover:text-black' : ''}`} />
                            <span className="text-xs">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
            <div className="h-px bg-gray-700 mb-3"></div>
            {/* Botton  Actions */}
            <div className="space-y-1">
                <button className="w-full flex items-center justify-start gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-gray-200 hover:bg-white/5 transition-colors text-sm h-9 cursor-pointer">
                    <HelpCircle className='h-4 w-4'/>
                    <span className="text-xs">Help</span>
                </button>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-start gap-2 px-3 py-2 rounded-lg transition-colors text-sm h-9 hover:bg-red-500/20 cursor-pointer"
                    style={{ color: '#ef4444' }}
                >
                    <LogOut className='h-4 w-4'/>
                    <span className="text-xs">Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar