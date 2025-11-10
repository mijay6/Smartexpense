import { useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { validateFilters } from '../../utils/filterValidation';
import Input from './Input';
import Select from './Select';
import DateInput from './DateInput';
import Button from './Button';

export function TransactionFilters({ categories, onFilter, onReset }) {

    const { symbol } = useCurrency();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setFieldErrors({});

        const errors = validateFilters(filters);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value) acc[key] = value;
            return acc;
        }, {});
        onFilter(activeFilters);
    };

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
    };

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
                    className="text-sm cursor-pointer"
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
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Min Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                {symbol}
                            </span>
                            <input
                                type="number"
                                name="minAmount"
                                value={filters.minAmount}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className={`w-full pl-8 pr-3 py-2 border ${
                                    fieldErrors.minAmount ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                        </div>
                        {fieldErrors.minAmount && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.minAmount}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Max Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                {symbol}
                            </span>
                            <input
                                type="number"
                                name="maxAmount"
                                value={filters.maxAmount}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className={`w-full pl-8 pr-3 py-2 border ${
                                    fieldErrors.maxAmount ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                        </div>
                        {fieldErrors.maxAmount && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.maxAmount}</p>
                        )}
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button type="submit" variant="primary" className="cursor-pointer">
                        Apply Filters
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default TransactionFilters;
