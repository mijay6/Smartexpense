import prisma from './prisma.utils.js';
import { ValidationError } from './errors.utils.js';

export function validateAmount(amount, isRequired = true) {
    if (isRequired && !amount) {
        throw new ValidationError('Amount is required');
    }
    
    if (amount === undefined || amount === null) {
        return undefined;
    }

    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount)) {
        throw new ValidationError('Amount must be a valid number');
    }
    
    if (parsedAmount <= 0) {
        throw new ValidationError('Amount must be greater than zero');
    }
    
    if (parsedAmount >= 100000000) {
        throw new ValidationError('Amount cannot exceed 99,999,999.99');
    }
    
    const amountStr = amount.toString();
    const decimals = (amountStr.split('.')[1] || '').length;
    if (decimals > 2) {
        throw new ValidationError('Amount can have maximum 2 decimal places');
    }

    return parsedAmount;
}

export function validateDescription(description, isRequired = true) {
    if (isRequired && !description) {
        throw new ValidationError('Description is required');
    }
    
    if (description === undefined || description === null) {
        return undefined;
    }
    
    if (isRequired && !description.trim()) {
        throw new ValidationError('Description cannot be empty');
    }
    
    if (description.length > 255) {
        throw new ValidationError('Description cannot exceed 255 characters');
    }

    return description.trim();
}

export function validateNotes(notes) {
    if (notes === undefined || notes === null) {
        return undefined;
    }
    
    if (notes && notes.length > 1000) {
        throw new ValidationError('Notes cannot exceed 1000 characters');
    }

    return notes ? notes.trim() : null;
}

export async function validateCategory(categoryId, userId, isRequired = true, type = null) {
    if (isRequired && !categoryId) {
        throw new ValidationError('CategoryId is required');
    }
    
    if (categoryId === undefined || categoryId === null) {
        return undefined;
    }

    const id = parseInt(categoryId);
    const where = {
        id,
        userId
    };
    if (type) where.type = type;

    const category = await prisma.category.findFirst({ where });

    if (!category) {
        if (type) {
            throw new ValidationError(`Category must be of type "${type}"`);
        }
        throw new ValidationError('Category not found');
    }

    return id;
}

export default { validateAmount, validateDescription, validateNotes, validateCategory };