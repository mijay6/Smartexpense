import prisma from '../utils/prisma.utils.js';
import { NotFoundError, ValidationError, ConflictError} from '../utils/errors.utils.js';
import { hashPassword, strongPassword } from '../utils/password.utils.js';
import { createDefaultCategories } from '../utils/defaultCategories.utils.js';

export async function getAllUsers(req, res, next) {
    try {
        const { page = 1, limit = 50, search, role } = req.query;
        const skip = (page - 1) * limit;

        // Filters
        const where = {};
        
        if (search) {
            const searchTerms = search.trim().split(/\s+/);
            
            if (searchTerms.length === 1) {
                // Single word search: search in firstName, lastName, and email
                where.OR = [
                    { email: { contains: search, mode: 'insensitive' } },
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } }
                ];
            } else {
                // Multiple words: search for combinations
                where.OR = [
                    { email: { contains: search, mode: 'insensitive' } },
                    // Search each term individually
                    ...searchTerms.map(term => ({ firstName: { contains: term, mode: 'insensitive' } })),
                    ...searchTerms.map(term => ({ lastName: { contains: term, mode: 'insensitive' } })),
                    // Search for firstName AND lastName combination
                    {
                        AND: [
                            { firstName: { contains: searchTerms[0], mode: 'insensitive' } },
                            { lastName: { contains: searchTerms.slice(1).join(' '), mode: 'insensitive' } }
                        ]
                    }
                ];
            }
        }
        
        if (role) {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    country: true,
                    currency: true,
                    createdAt: true,
                    _count: {
                        select: {
                            expenses: true,
                            categories: true
                        }
                    }
                },
                skip: parseInt(skip),
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        res.json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserById(req, res, next) {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                country: true,
                currency: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        expenses: true,
                        categories: true
                    }
                },
                expenses: {
                    orderBy: { date: 'desc' },
                    include: {
                        category: {
                            select: { 
                                name: true, 
                                icon: true,
                                type: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.json({ user });
    } catch (error) {
        next(error);
    }
}

export async function updateUserRole(req, res, next) {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['USER', 'ADMIN'].includes(role)) {
            throw new ValidationError('Validation Error');
        }

        if (id === req.user.id) {
            throw new ValidationError('You cannot change your own role');
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true
            }
        });

        res.json({ 
            message: 'User role updated successfully',
            user 
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;

        if (id === req.user.id) {
            throw new ValidationError('You cannot delete your own account');
        }

        await prisma.user.delete({
            where: { id }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            next(new NotFoundError('User not found', 404));
        } else {
            next(error);
        }
    }
}

export async function getGlobalStats(req, res, next) {
    try {
        const [
            totalUsers,
            totalTransactions,
            totalCategories,
            recentUsers,
            topSpenders
        ] = await Promise.all([
            prisma.user.count(),
            prisma.transaction.count(),
            prisma.category.count(),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    createdAt: true
                }
            }),
            
            prisma.user.findMany({
                take: 10,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    expenses: {
                        select: {
                            amount: true
                        }
                    }
                }
            })
        ]);

        const topSpendersWithTotal = topSpenders
            .map(user => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                totalSpent: user.expenses.reduce((sum, t) => sum + Number(t.amount), 0),
                transactionCount: user.expenses.length
            }))
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5);

        res.json({
            totalUsers,
            totalTransactions,
            totalCategories,
            recentUsers,
            topSpenders: topSpendersWithTotal
        });
    } catch (error) {
        next(error);
    }
}

export async function createUser(req, res, next) {
    try {
        const { firstName, lastName, email, password, country, currency } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            throw new ValidationError('All fields are required');
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ConflictError('Email is already registered');
        }

        // Validate password strength
        const strong = strongPassword(password);
        if (!strong.isStrong) {
            throw new ValidationError(strong.error);
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: passwordHash,
                country: country || 'US',
                currency: currency || 'USD'
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                country: true,
                currency: true,
                createdAt: true
            }
        });

        // Create default categories for the new user
        await createDefaultCategories(prisma, user.id);

        res.status(201).json({
            message: 'User created successfully',
            user
        });
    } catch (error) {
        next(error);
    }
}

export default { getAllUsers, getUserById, updateUserRole, deleteUser, getGlobalStats, createUser };