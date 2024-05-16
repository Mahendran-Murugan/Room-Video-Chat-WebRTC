import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 7000;

const socket = new Server(PORT);

socket.on("connection", (socket) => {
    console.log(`Socket Connected `, socket.id)
})