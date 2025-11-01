export const defaultCategories = [
    { name: 'Food', color: '#22c55e', icon: '🍔', type: 'expense'},
    { name: 'Transport', color: '#3b82f6', icon: '🚗', type: 'expense' },
    { name: 'Housing', color: '#8b5cf6', icon: '🏠', type: 'expense' },
    { name: 'Entertainment', color: '#f59e0b', icon: '🎬', type: 'expense' },
    { name: 'Education', color: '#06b6d4', icon: '📚', type: 'expense' },
    { name: 'Health', color: '#ef4444', icon: '💊', type: 'expense' },
    { name: 'Clothing & Footwear', color: '#f97316', icon: '👗', type: 'expense' },
    { name: 'Others', color: '#9ca3af', icon: '🛍️', type: 'expense' },
]

export async function createDefaultCategories(prisma, userId) {
    for (const category of defaultCategories) {
        await prisma.category.create({
            data: {
                ...category,
                userId: userId,
                isDefault: true
            }
        });
    }
}

export default { defaultCategories, createDefaultCategories };