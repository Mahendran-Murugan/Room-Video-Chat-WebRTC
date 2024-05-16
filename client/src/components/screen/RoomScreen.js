import React, { useCallback, useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
import Peer from '../../services/peer'
import { useSocket } from '../contexts/SocketProvider';
import ReactPlayer from 'react-player';

export const RoomScreen = () => {
    // const { id } = useParams();
    const socket = useSocket();

    const [remoteSockId, setRemoteSockId] = useState();
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();

    const handleUserJoin = useCallback((data) => {
        const { email, id } = data;
        console.log(`Email ${email} joined Room with id ${id}`);
        setRemoteSockId(id);
    }, [])

    const handleIncommingVideo = useCallback(async ({ from, offer }) => {
        setRemoteSockId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        console.log(`Incomming call`, from, offer);
        const ans = await Peer.answerOffer(offer);
        socket.emit('call:accepted',
            {
                to: from,
                ans
            });
        setMyStream(stream);
    }, [socket])

    const handleCallAccept = useCallback(({ from, ans }) => {
        Peer.setLocalDescription(ans);
        console.log('Call Accepted');
        for (const track of myStream.getTracks()) {
            Peer.peer.addTrack(track, myStream);
        }
    }, [myStream])


    const handleNegotioation = useCallback(async () => {
        const offer = await Peer.getOffer();
        socket.emit('peer:negotiationneeded', { offer, to: remoteSockId })
    }, [remoteSockId, socket])


    const handleNegotioationIncomming = useCallback(async ({ from, offer }) => {
        const ans = await Peer.answerOffer(offer);
        socket.emit('peer:negotiationdone', { to: from, ans });
    }, [socket])

    const handleNegotioationFinal = useCallback(async ({ from, ans }) => {
        Peer.setLocalDescription(ans);
    }, [])

    useEffect(() => {
        Peer.peer.addEventListener('negotiationneeded', handleNegotioation)

        return () => {
            Peer.peer.removeEventListener('negotiationneeded', handleNegotioation);
        }
    }, [handleNegotioation])

    useEffect(() => {
        Peer.peer.addEventListener('track', async (e) => {
            const remoteStream = e.streams;
            setRemoteStream(remoteStream[0]);
        })
    })

    useEffect(() => {
        socket.on('user:joined', handleUserJoin);
        socket.on('incomming:call', handleIncommingVideo);
        socket.on('call:accepted', handleCallAccept);
        socket.on('peer:negotiationneeded', handleNegotioationIncomming);
        socket.on('peer:negotiationfinal', handleNegotioationFinal);
        return () => {
            socket.off('incomming:call', handleIncommingVideo);
            socket.off('user:joined', handleUserJoin);
            socket.off('call:accepted', handleCallAccept);
            socket.off('peer:negotiationneeded', handleNegotioationIncomming);
            socket.off('peer:negotiationfinal', handleNegotioationFinal);
        }
    }, [socket, handleUserJoin, handleIncommingVideo, handleCallAccept, handleNegotioationIncomming, handleNegotioationFinal])

    const handleVideChat = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await Peer.getOffer();
        socket.emit("user:call",
            {
                to: remoteSockId,
                offer
            })
        setMyStream(stream);
    }, [remoteSockId, socket]);

    return (
        <div className='flex items-center justify-center h-screen bg-primary'>
            <div>
                <h1 className='text-3xl font-bold underline text-background'>Room</h1>
                <h4 className='text-background'>{remoteSockId ? "Socket Connected" : "Empty Room"}</h4>
                {
                    remoteSockId && <button className='border- border-secondary bg-secondary text-white py-2 px-6 my-2 rounded-lg' onClick={handleVideChat}>Video Chat</button>
                }
                {
                    myStream &&
                    <div>
                        <h1 className='text-xl font-semibold text-background'>You</h1>
                        <ReactPlayer className="border-2 rounded-lg border-background" playing muted height="200px" width="400px" url={myStream} />
                    </div>
                }
                {
                    remoteStream &&
                    <div>
                        <h1 className='text-xl font-semibold text-background'>Remote</h1>
                        <ReactPlayer className="border-2 rounded-lg border-background" playing muted height="200px" width="400px" url={remoteStream} />
                    </div>
                }
            </div>
        </div >
    )
}
