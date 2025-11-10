import { useState, useEffect } from 'react';
import { useIncomeStore } from '../stores/incomeStore';
import { useToast } from '../hooks/useToast';
import { getErrorMessage } from '../utils/errorHandler';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import Sidebar from '../components/dashboard/Sidebar';
import IncomeList from '../components/incomes/IncomeList';
import TransactionFilters from '../components/shared/TransactionFilters';
import TransactionForm from '../components/shared/TransactionForm';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';

export function Incomes(){

    const { incomes, categories, loading, fetchIncomes, fetchCategories, createIncome, updateIncome, deleteIncome } = useIncomeStore();
    const { addToast } = useToast();

    const [activeTab, setActiveTab] = useState('incomes');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingIncome, setEditingIncome] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        document.title = 'Incomes - Expenso';
        const loadData = async () => {
            setIsLoading(true);
            try {
                await fetchCategories();
                await fetchIncomes();
            } catch (error) {
                addToast(getErrorMessage(error), 'error');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [fetchCategories, fetchIncomes, addToast]);

    const handleCreate = () => {
        setEditingIncome(null);
        setModalOpen(true);
    };

    const handleEdit = (incomes) => {
        setEditingIncome(incomes);
        setModalOpen(true);
    };

    const handlesubmit = async (data) => {
        try {
            if(editingIncome){
                await updateIncome(editingIncome.id, data);
                addToast('Income updated successfully!', 'success');
            }else{
                await createIncome(data);
                addToast('Income created successfully!', 'success');
            }
            setModalOpen(false);
            setEditingIncome(null);
        }
        catch(error){
            console.error('Failed to submit income:', error);
            addToast(getErrorMessage(error), 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteIncome(id);
            addToast('Income deleted successfully!', 'success');
        }
        catch(error){
            console.error('Failed to delete income:', error);
            addToast(getErrorMessage(error), 'error');
        }
    };

    const handleFilter = async (filters) => {
        try {
            await fetchIncomes(filters);
        } catch (error) {
            addToast(getErrorMessage(error), 'error');
        }
    };

    const handleResetFilters = async () => {
        try {
            await fetchIncomes();
        } catch(error){
            addToast(getErrorMessage(error), 'error');
        }
    }

    return(
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 overflow-y-auto relative bg-gray-100">
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
                        <LoadingSpinner size="lg">
                            Loading incomes...
                        </LoadingSpinner>
                    </div>
                )}
                {/* Header */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-6">
                        <div className="flex items-center justify-between"> 
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">💰Incomes</h1>
                                <p className="text-gray-600 mt-1">Manage and track your incomes</p>
                            </div>
                            <Button onClick={handleCreate} variant="primary" className="cursor-pointer">
                                + New Income
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <TransactionFilters 
                        categories={categories} 
                        onFilter={handleFilter}
                        onReset={handleResetFilters}
                    />
                    <IncomeList
                        incomes={incomes}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
                <div>
                {/* Modal to create/edit incomes */}
                <Modal 
                    isOpen={modalOpen}
                    onClose={() => {setModalOpen(false); setEditingIncome(null);}}
                    title={editingIncome ? 'Edit Income' : 'New Income'}
                >
                    <TransactionForm
                        transaction={editingIncome}
                        categories={categories}
                        onSubmit={handlesubmit}
                        onCancel={() => {setModalOpen(false); setEditingIncome(null)}}
                        loading={loading}
                        type="income"
                    />
                </Modal>    
                </div>
            </main>
        </div>
    );

}

export default Incomes;