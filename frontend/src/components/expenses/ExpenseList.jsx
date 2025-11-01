import ExpenseCard from './ExpenseCard';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function ExpenseList({ expenses, loading, onEdit, onDelete }){

    if(loading){
        return <LoadingSpinner />
    }

    if(!expenses || expenses.length === 0){
        return(
            <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No expenses found.
                </h3>
                <p className="text-gray-500">
                    Start by adding your first expense.
                </p>
            </div>
        );
    }
    
    return(
        <div className="space-y-3">
            {expenses.map((expense) => (
                <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
