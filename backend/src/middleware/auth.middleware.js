import { verifyToken } from '../utils/jwt.utils.js';
import { AuthenticationError, ForbiddenError } from '../utils/errors.utils.js';
import prisma from '../utils/prisma.utils.js';

export const authenticateToken = async (req, res, next) => {
    try {
        // Get token from authorization header "Bearer Token"
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) throw new AuthenticationError('No token provided');
        
        const decoded = verifyToken(token);
        
        // Attach user data to request for use in controllers
        req.userId = decoded.userId;
        
        next();
    } catch (error) {
        next(error);
    }
};

export async function requireAdmin(req, res, next) {
    try {
        // Get user from database to check role
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, role: true }
        });

        if (!user) {
            throw new AuthenticationError('User not found');
        }

        if (user.role !== 'ADMIN') {
            throw new ForbiddenError('Access denied. Admin privileges required');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

export function requireRole(...roles) {
    return async (req, res, next) => {
        try {
            // Get user from database to check role
            const user = await prisma.user.findUnique({
                where: { id: req.userId },
                select: { id: true, role: true }
            });

            if (!user) {
                throw new AuthenticationError('User not found');
            }

            if (!roles.includes(user.role)) {
                throw new ForbiddenError(`Access denied. Required role: ${roles.join(' or ')}`);
            }

            req.user = user;
            next();
        } catch (error) {
            next(error);
        }
    };
}

export default { authenticateToken, requireAdmin, requireRole};
