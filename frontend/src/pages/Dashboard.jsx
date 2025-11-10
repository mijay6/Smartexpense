import { useState, useEffect} from 'react'
import { useAuthStore } from '../stores/authStore';
import { useCurrency } from '../hooks/useCurrency';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import Sidebar from '../components/dashboard/Sidebar'
import StatsCard from '../components/dashboard/StatsCard';
import AnimatedTabs from '../components/dashboard/AnimatedTabs';
import ExpenseCard from '../components/dashboard/ExpenseChart';
import RecentExpenses from '../components/dashboard/RecentExpenses';
import { TrendingDown, Wallet, TrendingUp, PiggyBank, Bell, Plus } from 'lucide-react';

export function Dashboard(){

    const { user } = useAuthStore();
    const { format } = useCurrency();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [timeFilter, setTimeFilter] = useState('month');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = 'Dashboard - Expenso';
        
        // Here awaits when we load the dashboard data from backend

        const loadData = async () => { ///simulated
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsLoading(false);
        };
        
        loadData();
    }, []);

    // example data for stats cards (in raw numbers)
    const statsCardsDataRaw = {
        week: {
            totalSpent: 383.00,
            budgetRemaining: 152.00,
            income: 625.00,
            totalSavings: 3450.00,
        },
        month: {
            totalSpent: 1234.50,
            budgetRemaining: 765.50,
            income: 2500.00,
            totalSavings: 3450.00,
        },
        year: {
            totalSpent: 14694.00,
            budgetRemaining: 9306.00,
            income: 30000.00,
            totalSavings: 3450.00,
        },
    };

    // Format amounts with user's currency
    const statsCardsData = {
        week: {
            totalSpent: format(statsCardsDataRaw.week.totalSpent),
            totalSpentChange: '+8% from last week',
            budgetRemaining: format(statsCardsDataRaw.week.budgetRemaining),
            budgetRemainingChange: '28% of weekly budget',
            income: format(statsCardsDataRaw.week.income),
            incomeChange: '+2% from last week',
            totalSavings: format(statsCardsDataRaw.week.totalSavings),
            totalSavingsChange: '+1.5% this week',
        },
        month: {
            totalSpent: format(statsCardsDataRaw.month.totalSpent),
            totalSpentChange: '+12% from last month',
            budgetRemaining: format(statsCardsDataRaw.month.budgetRemaining),
            budgetRemainingChange: '38% of monthly budget',
            income: format(statsCardsDataRaw.month.income),
            incomeChange: '+5% from last month',
            totalSavings: format(statsCardsDataRaw.month.totalSavings),
            totalSavingsChange: '+8% this month',
        },
        year: {
            totalSpent: format(statsCardsDataRaw.year.totalSpent),
            totalSpentChange: '+10% from last year',
            budgetRemaining: format(statsCardsDataRaw.year.budgetRemaining),
            budgetRemainingChange: '39% of yearly budget',
            income: format(statsCardsDataRaw.year.income),
            incomeChange: '+7% from last year',
            totalSavings: format(statsCardsDataRaw.year.totalSavings),
            totalSavingsChange: '+15% this year',
        },
    };

    const currentDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const stats = statsCardsData[timeFilter] || statsCardsData.month;

    const tabs = [
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'year', label: 'This Year' },
    ];


    // render JSX
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
            />
            <main className="flex-1 overflow-y-auto relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
                        <LoadingSpinner size="lg">
                            Loading dashboard data...
                        </LoadingSpinner>
                    </div>
                )}
                
                {/*top bar*/}
                <div className=" bg-white border-b border-gray-200 px-6 py-4" >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Hello, {user?.firstName}!
                            </h1>
                            <p className="text-xs text-muted-foreground mt-1">{currentDate}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <AnimatedTabs
                                value={timeFilter}
                                onValueChange={setTimeFilter}
                                tabs={tabs}
                            />
                            <button className="relative p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                <Bell className="h-5 w-5 text-gray-600 cursor-pointer"/>
                                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-semibold bg-red-500 text-white rounded-full">
                                    3 {/* Example notification count. TODO: implement real notification count*/ }
                                </span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md cursor-pointer">
                                <Plus className="h-4 w-4"/>
                                <span className="text-sm font-medium">Quick Actions</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-6">
                {/* stats grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatsCard
                            title="Total Spent"
                            value={stats.totalSpent}
                            change={stats.totalSpentChange}
                            icon={TrendingDown}
                            iconColor="bg-red-500"
                        />
                        <StatsCard
                            title="Budget Remaining"
                            value={stats.budgetRemaining}
                            change={stats.budgetRemainingChange}
                            icon={Wallet}
                            iconColor="bg-orange-500"
                        />
                        <StatsCard
                            title="Income"
                            value={stats.income}
                            change={stats.incomeChange}
                            icon={TrendingUp}
                            iconColor="bg-green-500"
                        />
                        <StatsCard
                            title="Total Savings"
                            value={stats.totalSavings}
                            change={stats.totalSavingsChange}
                            icon={PiggyBank}
                            iconColor="bg-blue-500"
                        />
                    </div>
                    {/* main content */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" >
                        <div className="lg:col-span-3 space-y-6">
                            <ExpenseCard timeFilter={timeFilter} />
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <RecentExpenses />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;