import React from 'react'
import { useParams } from 'react-router-dom'

export const RoomScreen = () => {

    const { id } = useParams();
    console.log(id);

    return (
        <div className='flex items-center justify-center'>
            <h1 className='text-3xl font-bold underline'>Room</h1>
        </div>
    )
}
