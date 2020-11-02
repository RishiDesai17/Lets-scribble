import React, { useCallback, useRef } from 'react';
import useStore from '../zustand/store';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';

const Home: React.FC = (props) => {
    const { setSocket, setRoom, setName, setIsHost, setMembers, getName } = useStore(useCallback(state => ({
        setSocket: state.setSocket,
        setRoom: state.setRoom,
        setName: state.setName,
        setIsHost: state.setIsHost,
        setMembers: state.setMembers,

        getName: state.getName
    }), []))

    const history = useHistory();

    const createRoom = () => {
        if(getName() === ""){
            alert("Please enter a name")
            return
        }
        const socket = io("/")
        setSocket(socket)
        socket.on("roomID", (roomID: string) => {
            setRoom(roomID)
            setIsHost(true)
            setMembers([{ socketID: socket.id, name: getName() }])
            history.replace(`/lobby/${roomID}`)
        })
        socket.emit("create room", getName())
    }

    return (
        <>
            <h1>Home</h1>
            <input onChange={e => {
                setName(e.target.value)
            }} />
            <button onClick={createRoom}>Create Private Room</button>
        </>
    )
}

export default Home