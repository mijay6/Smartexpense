import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;  // How many times is executed the hashing 

// Checks if a password is strong enough
export const strongPassword = (password) => {

    const errors = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isStrong: errors.length === 0,
        errors
    };
};


// Converts a plain text password into a hashed password
export const hashPassword = async (password) => {

    if(!password || typeof password !== 'string') {
        throw new Error('Password must be a non-empty string');
    }

    try{
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    }
    catch(error){
        throw new Error(`Error hashing password: ${error.mesage}`);
    }
};

// Compares a plain text password with a hashed password
export const comparePassword = async (password, hashedPassword) => {

    if(!password || typeof password !== 'string'){
        throw new Error('Password must be a non-empty string');
    }

    if(!hashedPassword || typeof hashedPassword !== 'string'){
        throw new Error('Hashed password must be a non-empty string');
    }

    try{
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch(error){
        throw new Error(`Error comparing password: ${error.message}`);
    }
};


export default {hashPassword, comparePassword, strongPassword};