import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL database connected successfully via Prisma');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Roxx Store Server running on http://localhost:${PORT}`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Prisma disconnected. Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
