import dotenv from 'dotenv';

dotenv.config();

export const enviroment = process.env.enviroment;

export const socketPort = enviroment === 'local' ? process.env.socketLocal : process.env.socketProd;