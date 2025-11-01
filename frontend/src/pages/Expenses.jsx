import {useState, useEffect} from 'react'
import { useExpenseStore } from '../stores/expenseStore';
import { useToast } from '../hooks/useToast';
import { getErrorMessage } from '../utils/errorHandler';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import ExpenseCard from '../components/expenses/ExpenseCard';
import Modal from '../components/shared/Modal';
import Button from '../components/shared/Button';

export function Expenses(){

    const { expenses, categories, loading, fetchExpenses, fetchCategories, createExpense, updateExpense, deleteExpense } = useExpenseStore();
    const { addToast } = useToast();
    
    const [modalOpen, setModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    // load data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchCategories();
                await fetchExpenses();
            } catch (error) {
                addToast(getErrorMessage(error), 'error');
            }
        };
        loadData();
    }, [fetchCategories, fetchExpenses, addToast]);
    
    // open modal for creating a new expense
    const handleCreate = () => {
        setEditingExpense(null);
        setModalOpen(true);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setModalOpen(true);
    };

    const handleSubmit = async (data) => {
        try {
            if(editingExpense){
                await updateExpense(editingExpense.id, data);
                addToast('Expense updated successfully!', 'success');
            }else{
                await createExpense(data);
                addToast('Expense created successfully!', 'success');
            }
            setModalOpen(false);
            setEditingExpense(null);    
        }
        catch(error){
            console.error('Failed to save expense:', error);
            addToast(getErrorMessage(error), 'error');
        }
    };

    const handleDelete = async (id) => {
        try{
            await deleteExpense(id);
            addToast('Expense deleted successfully!', 'success');
        } 
        catch(error){
            console.error('Failed to delete expense:', error);
            addToast(getErrorMessage(error), 'error');
        }
    };

    const handleFilter = async (filters) => {
        try {
            await fetchExpenses(filters);
        } catch (error) {
            addToast(getErrorMessage(error), 'error');
        }
    };

    const handleResetFilters = async () => {
        try {
            await fetchExpenses();
        } catch (error) {
            addToast(getErrorMessage(error), 'error');
        }
    };

    return(
        <div className="min-h-screen p-6 bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">💸Expenses</h1>
                            <p className="text-gray-600 mt-1">Manage and track your expenses</p>
                        </div>
                        <Button onClick={handleCreate} variant="primary">
                            + New Expense
                        </Button>
                    </div>
                </div>
            </div>
            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <ExpenseFilters 
                    categories={categories} 
                    onFilter={handleFilter}
                    onReset={handleResetFilters}
                />
                <ExpenseList
                    expenses={expenses}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
            {/* Modal to create/edit expense */}
            <Modal 
                isOpen={modalOpen}
                onClose={() => {setModalOpen(false); setEditingExpense(null);}}
                title={editingExpense ? 'Edit Expense' : 'New Expense'}
            >
                <ExpenseForm
                    expense={editingExpense}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onCancel={() => {setModalOpen(false); setEditingExpense(null)}}
                    loading={loading}
                />
            </Modal>
        </div> 
    );
}

export default Expenses;

