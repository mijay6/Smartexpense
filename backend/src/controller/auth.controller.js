import { ValidationError, ConflictError, AuthenticationError } from '../utils/errors.utils.js';
import prisma from '../utils/prisma.utils.js';
import { hashPassword, comparePassword, strongPassword } from '../utils/password.utils.js';
import { generateToken } from '../utils/jwt.utils.js';
import { createDefaultCategories } from '../utils/defaultCategories.utils.js';

// TODO: COmprobar si esta bien poner todo en un try, y no separarlo
// Se puede simplificar con "promises" mandando en una funcion generica que valida y envia los errores

// register new user
export async function register(req, res, next) {
    try{
        const {firstName, lastName, email, password} = req.body;

        if(!firstName || !lastName || !email || !password) throw new ValidationError('All fields are required');

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

        await createDefaultCategories(prisma, user.id);

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
        next(error);
    }
}

// login user
export async function login(req, res, next) {
    try {
        const {email, password} = req.body;

        if(!email || !password) throw new ValidationError('Email and password are required');

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
        next(error);
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
        next(error);
    }
}

export default { register, login, validateToken };