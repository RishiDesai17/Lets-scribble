import React, { useState, useCallback, useEffect } from 'react';
import useStore from '../zustand/store';
import { useHistory, useParams } from 'react-router-dom';
import io from 'socket.io-client';

type RouteParams = {
    room: string
}

const Lobby: React.FC = (props) => {
    const { setSocket, setRoom, setMembers, getRoom, getSocket, members } = useStore(useCallback(state => ({
        setSocket: state.setSocket,
        setRoom: state.setRoom,
        setMembers: state.setMembers,
        getSocket: state.getSocket,
        getRoom: state.getRoom,
        members: state.members
    }), []))

    const history = useHistory()
    const { room } = useParams<RouteParams>()

    useEffect(() => {
        if(getRoom() === ""){
            setRoom(room)
            const socket = io("/")
            setSocket(socket)
            socket.on("users in this room", (members: string[]) => {
                setMembers(members)
            })
            socket.emit("join room", room)
            socket.on("game started", () => {
                history.replace("/playground")
            })
        }
        getSocket().on("new member", (socketID: string) => {
            setMembers([...members, socketID])
        })
    }, [])

    const startGame = () => {
        getSocket().emit("start game")
        history.replace("/playground")
    }

    return (
        <>
            <h1>Lobby</h1>
            <h4>{getRoom()}</h4>
            <p>{JSON.stringify(members)}</p>
            <button onClick={startGame}>Start game</button>
        </>
    )
}

export default Lobby