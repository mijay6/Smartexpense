export const validateFilters = (filters) => {
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

    return errors;
};
