import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export const config = {

    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

    databaseUrl: process.env.DATABASE_URL,

    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    saltRound: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10,

};

export default config;