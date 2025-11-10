import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { useCurrency } from '../../hooks/useCurrency';

export function ExpenseChart({ timeFilter }){

    const { format } = useCurrency();

        // Data of example for the chart
    const expenseDataByPeriod={
        week: [
        { name: 'Food', value: 38, amount: 145, color: '#3b82f6' },
        { name: 'Transport', value: 22, amount: 85, color: '#8b5cf6' },
        { name: 'Entertainment', value: 18, amount: 68, color: '#ec4899' },
        { name: 'Housing', value: 12, amount: 45, color: '#f59e0b' },
        { name: 'Clothing', value: 5, amount: 20, color: '#06b6d4' },
        { name: 'Health', value: 3, amount: 12, color: '#10b981' },
        { name: 'Education', value: 2, amount: 8, color: '#f43f5e' },
        ],
        month: [
        { name: 'Food', value: 35, amount: 432, color: '#3b82f6' },
        { name: 'Transport', value: 20, amount: 247, color: '#8b5cf6' },
        { name: 'Entertainment', value: 15, amount: 185, color: '#ec4899' },
        { name: 'Housing', value: 20, amount: 247, color: '#f59e0b' },
        { name: 'Clothing', value: 5, amount: 62, color: '#06b6d4' },
        { name: 'Health', value: 3, amount: 37, color: '#10b981' },
        { name: 'Education', value: 2, amount: 24, color: '#f43f5e' },
        ],
        year: [
        { name: 'Food', value: 33, amount: 4845, color: '#3b82f6' },
        { name: 'Transport', value: 21, amount: 3087, color: '#8b5cf6' },
        { name: 'Entertainment', value: 14, amount: 2058, color: '#ec4899' },
        { name: 'Housing', value: 22, amount: 3234, color: '#f59e0b' },
        { name: 'Clothing', value: 6, amount: 882, color: '#06b6d4' },
        { name: 'Health', value: 2, amount: 294, color: '#10b981' },
        { name: 'Education', value: 2, amount: 294, color: '#f43f5e' },
        ],
    };

    const expenseData = expenseDataByPeriod[timeFilter] || expenseDataByPeriod.month;
    //const totalAmount = expenseData.reduce((sum, item) => sum + item.amount, 0);
    const periodLabel = timeFilter === 'week' ? 'week' : timeFilter === 'month' ? 'month' : 'year';

    return(
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Expense Distribution</h3>
            <p className="text-sm text-gray-500 mb-4">Summary of expenses in the current {periodLabel}</p>
            <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="relative shrink-0">
                    <ResponsiveContainer width={260} height={260}>
                       <PieChart key={timeFilter}>
                           <Pie
                                data={expenseData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                dataKey="value"
                                paddingAngle={3}
                                animationBegin={0}
                                animationDuration={800}
                            >
                                {expenseData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name, props) => [format(props.payload.amount), `${value}%`]}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-1 grid grid-cols-1 gap-2 w-full">
                    {expenseData.map((item, index) =>(
                        <motion.div 
                            key={`${item.name}-${timeFilter}`}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            initial={{ opacity: 0, x: -20}}
                            animate={{ opacity: 1, x: 0}}
                            transition={{ delay: index * 0.1, duration: 0.4}}
                        >
                            <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                                <div> 
                                    <p className="text-xs font-medium text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.value}% of total</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-semibold text-gray-900">{format(item.amount)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ExpenseChart;