import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 7000;

const socketServer = new Server(PORT, {
    cors: true,
});

const mapUsernameWithSocketId = new Map();
const mapSocketIdWithUsername = new Map();

socketServer.on("connection", (socket) => {
    console.log(`Socket Connected `, socket.id)
    socket.on('room:join', (data) => {
        const { username, email, room } = data;
        mapUsernameWithSocketId.set(username, socket.id);
        mapSocketIdWithUsername.set(socket.id, username);
        socketServer.to(socket.id).emit('room:join', data);
    })
})