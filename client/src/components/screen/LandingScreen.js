import React, { useCallback, useState, useEffect } from 'react'
import { useSocket } from '../contexts/SocketProvider';
import { useNavigate } from 'react-router-dom';

export const LandingScreen = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");

    const socket = useSocket();

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        socket.emit('room:join', {
            username,
            email,
            room
        })
    }, [username, email, room, socket]);


    const handleJoin = useCallback((data) => {
        const { room } = data;
        navigate(`/room/${room}`)
    }, [navigate])

    useEffect(() => {
        socket.on("room:join", handleJoin);
        return () => {
            socket.off("room.join", handleJoin);
        }
    }, [socket, handleJoin]);

    return (
        <div className='flex justify-center items-center h-screen bg-primary'>
            <form className='w-96 p-6 shadow-lg bg-background rounded-md' onSubmit={handleSubmit}>
                <h1 className='text-3xl text-center text-secondary font-semibold '>Video Chat Room</h1>
                <hr className='my-6' />
                <input type='text' value={username} className='border w-full text-base p-3 my-2 focus:outline-none focus:ring-0 focus:border-gray-600 rounded-lg' onChange={e => setUsername(e.target.value)} placeholder='Username' />
                <input type='email' value={email} className='border w-full text-base p-3 my-2 focus:outline-none focus:ring-0 focus:border-gray-600 rounded-lg' onChange={e => setEmail(e.target.value)} placeholder='Email' />
                <input type='text' value={room} className='border w-full text-base p-3 my-2 focus:outline-none focus:ring-0 focus:border-gray-600 rounded-lg' onChange={e => setRoom(e.target.value)} placeholder='Room Name' />
                <button type='submit' className='border- border-secondary bg-secondary text-white py-2 w-full my-2 rounded-lg'>Join</button>
            </form>
        </div>
    )
}
