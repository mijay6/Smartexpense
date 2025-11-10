export const defaultExpenseCategories = [
    { name: 'Food', color: '#22c55e', icon: '🍔', type: 'expense'},
    { name: 'Transport', color: '#3b82f6', icon: '🚗', type: 'expense' },
    { name: 'Housing', color: '#8b5cf6', icon: '🏠', type: 'expense' },
    { name: 'Entertainment', color: '#f59e0b', icon: '🎬', type: 'expense' },
    { name: 'Education', color: '#06b6d4', icon: '📚', type: 'expense' },
    { name: 'Health', color: '#ef4444', icon: '💊', type: 'expense' },
    { name: 'Clothing & Footwear', color: '#f97316', icon: '👗', type: 'expense' },
    { name: 'Others', color: '#9ca3af', icon: '🛍️', type: 'expense' },
]

export const defaultIncomeCategories = [
    { name: 'Salary', color: '#22c55e', icon: '💼', type: 'income' },
    { name: 'Bonus', color: '#f59e0b', icon: '🎁', type: 'income' },
    { name: 'Freelancing', color: '#3b82f6', icon: '🖥️', type: 'income' },
    { name: 'Investments', color: '#8b5cf6', icon: '📈', type: 'income' },
    { name: 'Sales', color: '#ec4899', icon: '🛒', type: 'income' },
    { name: 'Ohters', color: '#6b7280', icon: '💰', type: 'income' },
]

export async function createDefaultCategories(prisma, userId) {
    for (const category of defaultExpenseCategories) {
        await prisma.category.create({
            data: {
                ...category,
                userId: userId,
                isDefault: true
            }
        });
    }
    for (const category of defaultIncomeCategories){
        await prisma.category.create({
            data: {
                ...category,
                userId: userId,
                isDefault: true
            }
        });
    }
}

export default { createDefaultCategories };