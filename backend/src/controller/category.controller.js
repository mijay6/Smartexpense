import prisma  from '../utils/prisma.utils.js';

export async function getExpenseCategories(req, res, next) {
    try{
        const userId = req.userId;
        const categories =  await prisma.category.findMany({
            where: {
                userId,
                type: 'expense'
            },
            orderBy: {
                name: 'asc'
            }
        });
        res.json({ categories });
    }
    catch(error){
        next(error);
    }
}

export async function getIncomeCategories(req, res, next) {
    try{
        const userId = req.userId;
        const categories = await prisma.category.findMany({
            where: {
                userId,
                type: 'income'
            },
            orderBy: {
                name: 'asc'
            }
        });
        res.json({ categories });
    }
    catch(error){
        next(error);
    }

}

export default { getExpenseCategories, getIncomeCategories };