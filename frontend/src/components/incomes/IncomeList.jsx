import IncomeCard from "./IncomeCard";
import LoadingSpinner from "../shared/LoadingSpinner";

export function IncomeList({ incomes, loading, onEdit, onDelete }) {

    if (loading) {
        return <LoadingSpinner />
    }

    if (!incomes || incomes.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No incomes found.
                </h3>
                <p className="text-gray-500">
                    Start by adding your first income.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {incomes.map((income) => (
                <IncomeCard
                    key={income.id}
                    income={income}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default IncomeList;