import { useState } from 'react';
import Input from '../shared/Input';
import Select from '../shared/Select';
import DateInput from '../shared/DateInput';
import Button from '../shared/Button';

export function ExpenseForm({ expense = null, categories, onSubmit, onCancel, loading }) {

    const [formData, setFormData] = useState({
        amount: expense?.amount || '',
        description : expense?.description || '',
        date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        categoryId: expense?.categoryId || '',
        notes: expense?.notes || '',
    });

    const [fieldErrors, setFieldErrors] = useState({});
    
    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: `${cat.icon} ${cat.name}`
    }));

    const handleChange = (e) => {
        const  {name, value} = e.target;

        setFormData({
            ...formData,
            [name]:value
        })

        if(fieldErrors[name]){
            setFieldErrors({
                ...fieldErrors,
                [name] : ''
            });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.amount) {
            errors.amount = 'Amount is required';
        } else if (isNaN(formData.amount)) {
            errors.amount = 'Amount must be a valid number';
        } else if (parseFloat(formData.amount) <= 0) {
            errors.amount = 'Amount must be greater than 0';
        } else if (parseFloat(formData.amount) >= 100000000) {
            errors.amount = 'Amount cannot exceed 99,999,999.99';
        } else {
            const decimals = (formData.amount.toString().split('.')[1] || '').length;
            if (decimals > 2) {
                errors.amount = 'Amount can have maximum 2 decimal places';
            }
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        } else if (formData.description.length > 255) {
            errors.description = `Description cannot exceed 255 characters (${formData.description.length}/255)`;
        }

        if (formData.notes && formData.notes.length > 1000) {
            errors.notes = `Notes cannot exceed 1000 characters (${formData.notes.length}/1000)`;
        }

        // TODO: see because in schema is required but is set as default if it is not provided
        if (!formData.date) {
            errors.date = 'Date is required';
        }

        if (!formData.categoryId) {
            errors.categoryId = 'Please select a category';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});

        if(!validateForm()) return;

        try {
            await onSubmit(formData);
        }
        catch (error) {
            if (error.response?.status === 400 && error.response.data?.errors) {
                setFieldErrors(error.response.data.errors);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-6' noValidate>
            <Input
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
                min="0.01"
                step="0.01"
                error={fieldErrors.amount}
            />  
            <Input
                label="Description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                required
                maxLength={255}
                error={fieldErrors.description}
            />
            <DateInput
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                error={fieldErrors.date}
            />
            <Select
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                options={categoryOptions}
                placeholder='Select category'
                required
                error={fieldErrors.categoryId}
            />
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes {formData.notes && (
                        <span className="text-xs text-gray-500">
                            ({formData.notes.length}/1000)
                        </span>
                    )}
                </label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional notes (optional)"
                    rows="3"
                    maxLength={1000}
                    className={`w-full px-3 py-2 border ${
                        fieldErrors.notes ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {fieldErrors.notes && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.notes}</p>
                )}
            </div>
            <div className="flex gap-3 justify-end">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Saving...' : (expense ? 'Update' : 'Create')} Expense
                </Button>
            </div>
        </form>
    );
}

export default ExpenseForm;