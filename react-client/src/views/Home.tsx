import React, { useCallback } from 'react';
import useStore from '../zustand/store';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';

const Home: React.FC = (props) => {
    const { setSocket, setRoom, setIsHost, setMembers } = useStore(useCallback(state => ({
        setSocket: state.setSocket,
        setRoom: state.setRoom,
        setIsHost: state.setIsHost,
        setMembers: state.setMembers
    }), []))

    const history = useHistory();

    const createRoom = () => {
        const socket = io("/")
        setSocket(socket)
        socket.on("roomID", (roomID: string) => {
            setRoom(roomID)
            setIsHost(true)
            setMembers([socket.id])
            history.replace(`/lobby/${roomID}`)
        })
        socket.emit("create room")
    }

    return (
        <>
            <h1>Home</h1>
            <button onClick={createRoom}>Create Private Room</button>
        </>
    )
}

export default Home