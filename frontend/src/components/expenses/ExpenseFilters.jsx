import { useState } from 'react';
import Input from '../shared/Input';
import Select from '../shared/Select';
import DateInput from '../shared/DateInput';
import Button from '../shared/Button';

export default function ExpenseFilters({ categories, onFilter, onReset }) {

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        categoryId: '',
        search: '',
        minAmount: '',
        maxAmount: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateFilters = () => {
        const errors = {};

        if (filters.minAmount) {
            const min = parseFloat(filters.minAmount);
            if (isNaN(min)) {
                errors.minAmount = 'Must be a valid number';
            } else if (min < 0) {
                errors.minAmount = 'Must be greater than or equal to 0';
            } else if (min >= 100000000) {
                errors.minAmount = 'Cannot exceed 99,999,999.99';
            } else {
                const decimals = (filters.minAmount.toString().split('.')[1] || '').length;
                if (decimals > 2) {
                    errors.minAmount = 'Maximum 2 decimal places';
                }
            }
        }

        if (filters.maxAmount) {
            const max = parseFloat(filters.maxAmount);
            if (isNaN(max)) {
                errors.maxAmount = 'Must be a valid number';
            } else if (max < 0) {
                errors.maxAmount = 'Must be greater than or equal to 0';
            } else if (max >= 100000000) {
                errors.maxAmount = 'Cannot exceed 99,999,999.99';
            } else {
                const decimals = (filters.maxAmount.toString().split('.')[1] || '').length;
                if (decimals > 2) {
                    errors.maxAmount = 'Maximum 2 decimal places';
                }
            }
        }

        if (filters.minAmount && filters.maxAmount) {
            const min = parseFloat(filters.minAmount);
            const max = parseFloat(filters.maxAmount);
            if (!isNaN(min) && !isNaN(max) && min > max) {
                errors.minAmount = 'Min cannot be greater than Max';
                errors.maxAmount = 'Max cannot be less than Min';
            }
        }

        if (filters.search && filters.search.length > 100) {
            errors.search = `Maximum 100 characters (${filters.search.length}/100)`;
        }

        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            if (start > end) {
                errors.startDate = 'Start date cannot be after end date';
                errors.endDate = 'End date cannot be before start date';
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // becouse we dont work with backend data, we wont use async
    const handleSubmit = (e) => {
        e.preventDefault();
        setFieldErrors({});

        if (!validateFilters()) return;

        // filtrate only filled fields
        const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value) acc[key] = value;
            return acc;
        }, {});
        onFilter(activeFilters);
    };

    // Manage reset filters
    const handleReset = () => {
        setFilters({
            startDate: '',
            endDate: '',
            categoryId: '',
            search: '',
            minAmount: '',
            maxAmount: '',
        });
        setFieldErrors({});
        onReset();
    }

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: `${cat.icon} ${cat.name}`
    }));

    return( 
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex item-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900"> 🔍 Filters</h3>
                <Button 
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                    className="text-sm"
                >
                    Clean Filters
                </Button>
            </div>
            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Input
                        label="Search"
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Description..."
                        maxLength={100}
                        error={fieldErrors.search}
                    />
                    <Select
                        label="Category"
                        name="categoryId"
                        value={filters.categoryId}
                        onChange={handleChange}
                        options={categoryOptions}
                        placeholder="All Categories"
                        error={fieldErrors.categoryId}
                    />
                    <DateInput
                        label="Start Date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleChange}
                        error={fieldErrors.startDate}
                    />
                    <DateInput
                        label="End Date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleChange}
                        error={fieldErrors.endDate}
                    />
                    <Input
                        label="Min Amount"
                        type="number"
                        name="minAmount"
                        value={filters.minAmount}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        error={fieldErrors.minAmount}
                    />
                    <Input
                        label="Max Amount"
                        type="number"
                        name="maxAmount"
                        value={filters.maxAmount}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        error={fieldErrors.maxAmount}
                    />
                </div>
                <div className="mt-4 flex justify-end">
                    <Button type="submit" variant="primary">
                        Apply Filters
                    </Button>
                </div>
            </form>
        </div>
    );
}