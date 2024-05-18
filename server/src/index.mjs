import { Server } from 'socket.io';
import { createServer } from 'http'
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 7000;

const httpServer = createServer();

const socketServer = new Server(httpServer, {
    cors: true,
});

httpServer.listen(PORT, () => {
    console.log(`Server is Running on http://localhost:${PORT}`)
})

const mapUsernameWithSocketId = new Map();
const mapSocketIdWithUsername = new Map();

socketServer.on("connection", (socket) => {
    console.log(`Socket Connected `, socket.id)
    socket.on('room:join', (data) => {
        const { username, email, room } = data;
        socketServer.to(room).emit("user:joined", {
            username,
            email,
            id: socket.id
        })
        mapUsernameWithSocketId.set(username, socket.id);
        mapSocketIdWithUsername.set(socket.id, username);
        socket.join(room);
        socketServer.to(socket.id).emit('room:join', data);
    })

    socket.on('user:call', ({ to, offer }) => {
        socketServer.to(to).emit('incomming:call', {
            from: socket.id,
            offer
        });
    });

    socket.on('call:accepted', ({ to, ans }) => {
        socketServer.to(to).emit('call:accepted', {
            from: socket.id,
            ans
        });
    });

    socket.on('peer:negotiationneeded', ({ to, offer }) => {
        socketServer.to(to).emit('peer:negotiationneeded', {
            from: socket.id,
            offer
        });
    })

    socket.on('peer:negotiationdone', ({ to, ans }) => {
        socketServer.to(to).emit('peer:negotiationfinal', {
            from: socket.id,
            ans
        });
    })
})