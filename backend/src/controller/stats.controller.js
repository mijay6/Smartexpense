import { prisma } from '../utils/prisma.js';

// TODO: COnsideret to do anoer controller for transactions
// get transactions statistics

export async function getTransactionsStats(req, res){

    try{
        const userId = req.userId;
        const { startDate, endDate } = req.query;

        const where = { userId };

        // TODO Posible improvements: validate date format and order of dates
        if (startDate || endDate ){
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);  
            if (endDate) where.date.lte = new Date(endDate);
        }

        // total expenses
        const totalExpenses =  await prisma.transaction.aggregate({
            where: {
                ...where,
                category: {
                    type: 'expense'
                }
            },
            _sum: {
                amount: true
            },
            _count: true
        });

        // total income
        const totalIncome = await prisma.transaction.aggregate({
            where: {
                ...where,
                category: {
                    type: 'income'
                }
            },
            _sum: {
                amount: true
            },
            _count: true
        });
        
        // total savings
        const totalSavings = await prisma.transaction.aggregate({
            where : {
                ...where,
                category: {
                    type: 'savings'
                }
            },
            _sum: {
                amount: true
            },
            _count: true
        });

        // total expense by category 
        const expenseByCategory = await prisma.transaction.groupBy({
            by: ['categoryId'],
            where: {
                ...where,
                category: { 
                    type: 'expense'
                }
            },
            _sum:{
                amount: true
            },
            _count: true,
            orderBy: {
                _sum: {
                    amount: 'desc'
                }
            }
        });

        // TODO, calculate balance, sumary, etc..
        // TODO  calculet trends (%) from last mount , week , year..

    }
    catch (error){
        // TODO: Improve errors
         res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
