import { ValidationError, ConflictError, AuthenticationError } from '../utils/errors.js';
import prisma from '../utils/prisma.js';
import { hashPassword, comparePassword, strongPassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';


// TODO: COmprobar si esta bien poner todo en un try, y no separarlo

// register new user
export async function register(req, res) {

    try{
        const {firstName, lastName, email, password} = req.body;

        if(!firstName) throw new ValidationError('First name is required');
        if(!lastName) throw new ValidationError('Last name is required');
        if(!email) throw new ValidationError('Mail is required');
        if(!password) throw new ValidationError('Password is required');

        const existingUser = await prisma.user.findUnique({where : { email }});
        if (existingUser) throw new ConflictError('Mail is already registered')
        
        const strong = strongPassword(password);
        if(!strong.isStrong) throw new ValidationError(strong.error);

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: passwordHash
            }
        });

        const token = generateToken({ userId: user.id })

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token
        });
    }
    catch (error) {

        if(error instanceof ValidationError || error instanceof ConflictError) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }
        
        console.error(`Unnexpected error in registration ${error.message}`);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

// login user
export async function login(req, res) {

    try {
        const {email, password} = req.body;

        if(!email) throw new ValidationError('Mail is required');
        if(!password) throw new ValidationError('Password is required');

        const user = await prisma.user.findUnique({where: {email}});
        if(!user) throw new  AuthenticationError('Invalid email or password');  // Do not specify which one is wrong for security reasons

        const isValidPassword = await comparePassword(password, user.password);
        if(!isValidPassword) throw new AuthenticationError('Invalid email or password');

        const token = generateToken({ userId: user.id });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token
        });
    }
    catch(error){
        console.log(error);
        if(error instanceof ValidationError || error instanceof AuthenticationError) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }
        console.error(`Unnexpected error in login ${error.message}`);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

// validate token
export async function validateToken(req, res) {
    try {
        
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
            }
        });

        if (!user) throw new AuthenticationError('User not found');

        res.status(200).json({
            valid: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        if (error instanceof AuthenticationError) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }
        
        console.error(`Unexpected error in token validation: ${error.message}`);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

export default { register, login, validateToken };