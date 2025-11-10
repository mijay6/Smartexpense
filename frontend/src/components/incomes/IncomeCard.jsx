import { useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export function IncomeCard({ income, onEdit, onDelete }) {

    const { format } = useCurrency();  
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

    const handleDelete = async () => {
        setIsDeleting(true);
        try{
            await onDelete(income.id);
            setShowDeleteModal(false);
        }
        catch(error){
            console.error('Failed to delete income:', error);
            setShowDeleteModal(false);
        }
        finally {
            setIsDeleting(false);
        }
    };

    return(
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border-l-4"
            style={{ borderLeftColor: income.category?.color || "#6b7280"}}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="flex items-start justify-between">
                {/* Main Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{income.category?.icon || '💰'}</span>
                        <div>
                            <h3 className="font-semibold text-gray-800">
                                {income.description}
                            </h3>
                            <p className= "text-sm text-gray-500">
                                {income.category?.name || "Uncategorized"}
                            </p>
                        </div>
                    </div>
                    {income.notes && (
                        <p className="text-sm text-gray-600 mt-2 ml-9">
                            💬 {income.notes}
                        </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 ml-9 text-xs text-gray-500">
                        <span>📅 {formatDate(income.date)}</span>
                    </div>
                </div>
                {/* Amount */}
                <div className="text-right ml-4">
                    <p className="text-xl font-bold text-green-600">
                        +{format(income.amount)}
                    </p>
                    {/* Action Buttons */}
                    {showActions && (
                        <div className="flex flex-col items-end mt-2 space-y-2">
                            <button // TODO: See if we can use the Button component here
                                onClick={()=> onEdit(income)}
                                className="text-gray-600 hover:text-blue-700 text-sm cursor-pointer"
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="text-gray-600 hover:text-red-600 text-sm cursor-pointer"
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
                    title="Delete Income"
                    size="sm"
                >
                    <div className="space-y-4">
                        <p>Are you sure you want to delete this income?</p>
                        <div className="bg-gray-50 p-3 rounded">
                            <p className="font-semibold">{income.description}</p>
                            <p className="text-sm text-gray-600">{format(income.amount)}</p>
                        </div>
                        <p className="text-sm text-red-600">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1 cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 cursor-pointer"
                            >
                                {isDeleting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <LoadingSpinner size="xs" color="white" inline/>
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

export default IncomeCard;