import 'dotenv/config'
import app from "./app"
import { prisma } from './lib/prisma';
import config from './config';

const main = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to the database successfully.');
        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    } catch (error) {
        prisma.$disconnect();
        console.error('Error starting the server:', error);
        process.exit(1);
    }
} 

main()