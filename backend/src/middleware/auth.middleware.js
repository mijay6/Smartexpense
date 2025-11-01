import { verifyToken } from '../utils/jwt.utils.js';
import { AuthenticationError } from '../utils/errors.utils.js';

export const authenticateToken = (req, res, next) => {
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

export default { authenticateToken };
