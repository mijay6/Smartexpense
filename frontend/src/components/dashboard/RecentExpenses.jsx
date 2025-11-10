import { ShoppingCart, Car, Tv, Utensils, Smartphone, Zap, ArrowRight} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrency } from '../../hooks/useCurrency';
import { useNavigate } from 'react-router-dom'

//TODO: This will be replaced with real data form bakenda and renamed as recent movements, not only expenses

export function RecentExpenses() {
    
    const { format } = useCurrency();
    const navigate = useNavigate();

    const recentExpenses = [
        {
            id: 1,
            store: 'Kaufland',
            category: 'Food',
            amount: 45.50,
            date: 'Oct 18, 2025',
            icon: ShoppingCart,
            iconColor: '#3b82f6',
        },
        {
            id: 2,
            store: 'Shell',
            category: 'Transport',
            amount: 60.00,
            date: 'Oct 17, 2025',
            icon: Car,
            iconColor: '#8b5cf6',
        },
        {
            id: 3,
            store: 'Netflix',
            category: 'Entertainment',
            amount: 12.99,
            date: 'Oct 15, 2025',
            icon: Tv,
            iconColor: '#ec4899',
        },
        {
            id: 4,
            store: 'Restaurant Plaza',
            category: 'Food',
            amount: 38.50,
            date: 'Oct 14, 2025',
            icon: Utensils,
            iconColor: '#3b82f6',
        },
        {
            id: 5,
            store: 'Vodafone',
            category: 'Bills',
            amount: 29.99,
            date: 'Oct 12, 2025',
            icon: Smartphone,
            iconColor: '#f59e0b',
        },
    ];


    return(
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Expenses</h3>
            <div className="space-y-2">
                {recentExpenses.map((expense, index) => {
                    const Icon = expense.icon;
                    return(
                        <motion.div
                            key={expense.id}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            initial={{ opacity: 0, x: -10}}
                            animate={{ opacity: 1, x: 0}}
                            transition={{delay: index * 0.05, duration: 0.3}}
                        >
                            <div 
                                className="p-1.5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: expense.iconColor + '20' }}
                            >
                                <Icon className="h-3 w-3" style={{ color: expense.iconColor }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">{expense.store}</p>
                                <p className="text-xs text-gray-500">{expense.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-semibold text-red-500">{format(expense.amount)}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            <button
                onClick={() => {navigate('/expenses');}}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700 cursor-pointer"
            >
                View All Expenses
                <ArrowRight className="h-3 w-3"/>
            </button>
        </div>
    );
}

export default RecentExpenses;