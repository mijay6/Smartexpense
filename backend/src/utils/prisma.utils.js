import {PrismaClient} from '@prisma/client';
import config from '../config/config.js';

const prisma = new PrismaClient({
    log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
    ],
    errorFormat: 'pretty'
});

// helth check
export const helthDatabase = async () => {
    try{
        await prisma.$queryRaw`SELECT 1`;
        return true;
    }catch(error){
        console.error(`Database helth check error: ${error.message}`);
        return false;
    }
};

// conect to the database
export const connectDatabase = async () => {
    try{
        await prisma.$connect();
        console.log('Database connected');
        await helthDatabase(); 
    }catch(error){
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
};


// disconnect from the database
export const disconnectDatabase = async () => {
    try{
        await prisma.$disconnect();
        console.log('Database disconnected');
    }catch(error){
        console.error(`Error disconnecting from database: ${error.message}`);
    }
};


// For development mode
if (config.nodeEnv === 'development'){
    prisma.$on('query', (e) => {
        console.log('Query: ' + e.query);
        console.log('Params: ' + e.params);
        console.log('Duration: ' + e.duration + 'ms');
        console.log('---');
    });
}

export default prisma;