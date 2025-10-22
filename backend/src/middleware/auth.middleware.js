import { verifyToken } from '../utils/jwt.js';


export const authenticateToken = (req, res, next) => {
    try {
        // Get token from authorization header "Bearer Token"
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ error: 'No token provided' });
        
        const decoded = verifyToken(token);
        
        // Attach user data to request for use in controllers
        req.userId = decoded.userId;
        
        next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

export default { authenticateToken };
