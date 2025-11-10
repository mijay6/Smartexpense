import prisma from '../utils/prisma.utils.js';
import { ValidationError, NotFoundError } from '../utils/errors.utils.js';
import { validateAmount, validateDescription, validateNotes, validateCategory } from '../utils/validation.utils.js';

export async function getIncomes(req, res, next) {
    try{
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

        const where = {
            userId,
            category: {
                type: 'income'
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

        // get income
        const incomes = await prisma.transaction.findMany({
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
            incomes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    }
    catch(error){
        next(error);
    }
}

export async function getIncome(req, res, next){
    try{
        const userId = req.userId;
        const { id } = req.params;

        const income = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
                category: {
                    type: 'income'
                }
            },
            include: {
                category: true
            }
        });

        if(!income) throw new NotFoundError('Income not found');
        res.json(income);

    }
    catch(error){
        next(error);
    }
}

export async function createIncome(req, res, next){
    try{
        const userId = req.userId;
        const { amount, description, date, categoryId, notes } = req.body;

        const validatedAmount = validateAmount(amount, true);
        const validatedDescription = validateDescription(description, true);
        const validatedNotes = validateNotes(notes);
        const validatedCategoryId = await validateCategory(categoryId, userId, true, 'income');

        const income = await prisma.transaction.create({
            data: {
                userId,
                amount: validatedAmount,
                description: validatedDescription,
                ...(date && { date: new Date(date) }),
                categoryId: validatedCategoryId,
                notes: validatedNotes,
                receiptUrl: null
            },
            include: {
                category: true
            }
        });

        res.status(201).json({
            message: 'Income created successfully',
            income
        });
    }
    catch(error){
        next(error);
    }
}

export async function updateIncome(req, res, next){
    try{
        const userId = req.userId;
        const { id } = req.params;
        const { amount, description, date, categoryId, notes } = req.body;

        const existingIncome = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
                category:{
                    type: 'income'
                }
            }
        })

        if(!existingIncome) throw new NotFoundError('Income not found');

        const validatedAmount = amount !== undefined ? validateAmount(amount, false) : undefined;
        const validatedDescription = description !== undefined ? validateDescription(description, false) : undefined;
        const validatedNotes = notes !== undefined ? validateNotes(notes) : undefined;
        const validatedCategoryId = categoryId !== undefined ? await validateCategory(categoryId, userId, false, 'income') : undefined;        
        
        const updateData = {};
        if (validatedAmount !== undefined) updateData.amount = validatedAmount;
        if (validatedDescription !== undefined) updateData.description = validatedDescription;
        if (date !== undefined) updateData.date = new Date(date);
        if (validatedCategoryId !== undefined) updateData.categoryId = validatedCategoryId;
        if (validatedNotes !== undefined) updateData.notes = validatedNotes;
        
        const income = await prisma.transaction.update({
            where: { id },
            data: updateData,
            include: {
                category: true
            }
        });

        res.json({ message: 'Income updated successfully', income});
    }
    catch(error){
        next(error);
    }
}

export async function deleteIncome(req, res, next) {
    try{
        const userId = req.userId;
        const { id } = req.params;

        const income = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
                category: {
                    type: 'income'
                }
            }
        });

        if (!income) throw new NotFoundError('Income not found');

        await prisma.transaction.delete({
            where: { id }
        });

        res.json({ message: 'Income deleted successfully' });
    }
    catch(error){
        next(error);
    }
}

export default { getIncomes, getIncome, createIncome, updateIncome, deleteIncome };