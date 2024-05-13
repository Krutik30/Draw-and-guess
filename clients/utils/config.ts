import dotenv from 'dotenv';
import { io } from 'socket.io-client';

dotenv.config();

export const enviroment = process.env.enviroment;

export const socketPort = enviroment === 'local' ? process.env.socketLocal : process.env.socketProd;

export const socket = io('https://draw-and-guess-0958.onrender.com' || 'http://localhost:3001')
