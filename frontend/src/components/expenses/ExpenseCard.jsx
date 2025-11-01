import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export function ExpenseCard({ expense, onEdit, onDelete }) {
    
    const [showActions, setShowActions] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try{
            await onDelete(expense.id);
            setShowDeleteModal(false);
        }
        catch (error){
            console.error('Failed to delete expense:', error);
            // Error is handled by parent component with toast
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return(
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border-l-4"
            style={{ borderLeftColor: expense.category?.color || "#6b7280"}}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="flex items-start justify-between">
                {/* Main Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{expense.category?.icon || '💸'}</span>
                        <div>
                            <h3 className="font-semibold text-gray-800">
                                {expense.description}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {expense.category?.name || "Uncategorized"}
                            </p>
                        </div>
                    </div>
                    {expense.notes && (
                        <p className="text-sm text-gray-600 mt-2 ml-9">
                            💬 {expense.notes}
                        </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 ml-9 text-xs text-gray-500">
                        <span>📅 {formatDate(expense.date)}</span>
                        {expense.receiptUrl && (
                            <span>📎 Receipt attached</span>
                        )}
                    </div>
                </div>
                {/* Amount */}
                <div className="text-right ml-4">
                    <p className="text-xl font-bold text-red-600">
                        {formatAmount(expense.amount)}
                    </p>
                    {/* Action Buttons */}
                    {showActions && (
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => onEdit(expense)}
                                className="text-gray-600 hover:text-blue-700 text-sm"
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="text-gray-600 hover:text-red-600 text-sm"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </div>
                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Expense"
                    size="sm"
                >
                    <div className="space-y-4">
                        <p>Are you sure you want to delete this expense?</p>
                        <div className="bg-gray-50 p-3 rounded">
                            <p className="font-semibold">{expense.description}</p>
                            <p className="text-sm text-gray-600">{formatAmount(expense.amount)}</p>
                        </div>
                        <p className="text-sm text-red-600">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1"
                            >
                                {isDeleting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <LoadingSpinner size="xs" color="white" inline />
                                        Deleting...
                                    </span>
                                ) : (
                                    'Delete'
                                )}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default ExpenseCard;