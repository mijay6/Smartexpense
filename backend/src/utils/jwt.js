import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Function to generate JWT token
export const generateToken = (payload) => {

    if(!payload || typeof payload !== 'object') throw new Error('Payload must be an object');

    try{
        const token = jwt.sign(
            payload,
            config.jwtSecret,
            {
                expiresIn: config.jwtExpiresIn,
                issuer: 'smatexpense-api',      
                audience: 'smatexpense-client'
            }
        );
        return token;
    }catch(error){
        throw new Error(`Error generating token: ${error.message}`);
    }
}

// Function to verify JWT token
export const verifyToken = (token) => {
    
    if(!token || typeof token !== 'string') throw new Error('Token is requiered');
    
    try{
        const decoded = jwt.verify(
            token,
            config.jwtSecret,
            {
                issuer: 'smatexpense-api',
                audience: 'smatexpense-client'
            }
        );
        return decoded;
    }catch(error){

        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        }
        if (error.name === 'JsonWebTokenError'){
            throw new Error('Invalid token');
        }
        if (error.name === 'NotBeforeError'){
            throw new Error('Token not active');
        }

        throw new Error(`Error verifying token: ${error.message}`);
    }
};

export default { generateToken, verifyToken };