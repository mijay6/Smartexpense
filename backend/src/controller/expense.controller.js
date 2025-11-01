import prisma from '../utils/prisma.utils.js';
import { ValidationError, NotFoundError } from '../utils/errors.utils.js';

function validateAmount(amount, isRequired = true) {
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

function validateDescription(description, isRequired = true) {
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

function validateNotes(notes) {
    if (notes === undefined || notes === null) {
        return undefined;
    }
    
    if (notes && notes.length > 1000) {
        throw new ValidationError('Notes cannot exceed 1000 characters');
    }

    return notes ? notes.trim() : null;
}

async function validateCategory(categoryId, userId, isRequired = true) {
    if (isRequired && !categoryId) {
        throw new ValidationError('CategoryId is required');
    }
    
    if (categoryId === undefined || categoryId === null) {
        return undefined;
    }

    const category = await prisma.category.findFirst({
        where: {
            id: parseInt(categoryId),
            userId,
            type: 'expense'
        }
    });

    if (!category) {
        throw new ValidationError('Category must be of type "expense"');
    }

    return parseInt(categoryId);
}

export async function getExpenses(req, res, next) {
    try {
        const userId = req.userId;
        const {
            startDate,
            endDate,
            categoryId,
            minAmount,
            maxAmount,
            search,
            page = 1,
            limit = 50
        } = req.query;

        // make filters
        const where = {
            userId,
            category: {
                type: 'expense'
            }
        };

        if (startDate || endDate) {
            where.date = {};
            if (startDate) {
                const start = new Date(startDate);
                if (isNaN(start.getTime())) {
                    throw new ValidationError('Invalid startDate format');
                }
                where.date.gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                if (isNaN(end.getTime())) {
                    throw new ValidationError('Invalid endDate format');
                }
                where.date.lte = end;
            }
        }

        if (categoryId) where.categoryId = parseInt(categoryId);

        if (minAmount || maxAmount) {
            where.amount = {};
            if (minAmount) where.amount.gte = parseFloat(minAmount);
            if (maxAmount) where.amount.lte = parseFloat(maxAmount);
        }
        
        if (search) {
            where.description = {
                contains: search,
                mode: 'insensitive' 
            };
        }

        // calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // get expenses
        const expenses = await prisma.transaction.findMany({
            where,
            include: {
                category:true
            },
            orderBy:{
                date: 'desc'
            },
            skip,
            take: parseInt(limit)
        });

        const total = await prisma.transaction.count({ where });

        res.json({
            expenses,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        })

    }
    catch (error){
        next(error);
    }
}

// read a specific expense
export async function getExpense(req, res, next) {
    try{
        const userId = req.userId;
        const { id } = req.params;

        const expense = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
                category: {
                    type: 'expense'
                }
            },
            include: {
                category: true
            }
        });

        if(!expense) throw new NotFoundError('Expense not found');

        res.json(expense);
    }
    catch (error) {
        next(error);
    }
}

// create a new expense
export async function createExpense(req, res, next){
    try{
        const userId = req.userId
        const { amount, description, date, categoryId, notes, receiptUrl } = req.body;

        // Validar todos los campos usando las funciones helper
        const validatedAmount = validateAmount(amount, true);
        const validatedDescription = validateDescription(description, true);
        const validatedNotes = validateNotes(notes);
        const validatedCategoryId = await validateCategory(categoryId, userId, true);

        const expense = await prisma.transaction.create({
            data: {
                userId,
                amount: validatedAmount,
                description: validatedDescription,
                ...(date && {date: new Date(date)}),
                categoryId: validatedCategoryId,
                notes: validatedNotes,
                receiptUrl: receiptUrl || null
            },
            include: {
                category: true
            }  
        });

        res.status(201).json({
            message: 'Expense created successfully',
            expense
        });
    }
    catch (error){
        next(error);
    }
}

// update an existing expense
export async function updateExpense(req, res, next){
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { amount, description, date, categoryId, notes, receiptUrl } = req.body;
        
        const existingExpense = await prisma.transaction.findFirst({
            where: { 
                id,
                userId,
                category: {
                    type: 'expense'
                }
            }
        });

        if (!existingExpense) throw new NotFoundError('Expense not found');

        // Validar campos usando las funciones helper (no son requeridos en update)
        const validatedAmount = amount !== undefined ? validateAmount(amount, false) : undefined;
        const validatedDescription = description !== undefined ? validateDescription(description, false) : undefined;
        const validatedNotes = notes !== undefined ? validateNotes(notes) : undefined;
        const validatedCategoryId = categoryId !== undefined ? await validateCategory(categoryId, userId, false) : undefined;

        // Preparar datos para actualizar
        const updateData = {};
        if (validatedAmount !== undefined) updateData.amount = validatedAmount;
        if (validatedDescription !== undefined) updateData.description = validatedDescription;
        if (date !== undefined) updateData.date = new Date(date);
        if (validatedCategoryId !== undefined) updateData.categoryId = validatedCategoryId;
        if (validatedNotes !== undefined) updateData.notes = validatedNotes;
        if (receiptUrl !== undefined) updateData.receiptUrl = receiptUrl || null;

        const expense = await prisma.transaction.update({
            where: { id },
            data: updateData,
            include: {
                category: true
            }
        });

        res.json({ message: 'Expense updated successfully', expense});
    }
    catch (error){
        next(error);
    }
}

// delete an expense
export async function deleteExpense(req, res, next){
    try{
        const userId = req.userId;
        const { id } = req.params;

        const existingExpense = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
                category: {
                    type: 'expense'
                }
            }
        });

        if (!existingExpense) throw new NotFoundError('Expense not found');

        await prisma.transaction.delete({
            where: { id }
        });

        res.json({ message: 'Expense deleted successfully' });
    }
    catch (error) {
        next(error);
    }
}

export default { getExpenses, getExpense, createExpense, updateExpense, deleteExpense };