import React, { useState, useCallback, useEffect } from 'react';
import useStore from '../zustand/store';
import { useHistory, useParams } from 'react-router-dom';
import io from 'socket.io-client';

type RouteParams = {
    room: string
}

const Lobby: React.FC = (props) => {
    const { setSocket, setRoom, setMembers, addMember, getSocket, getIsHost, getRoom } = useStore(useCallback(state => ({
        setSocket: state.setSocket,
        setRoom: state.setRoom,
        setMembers: state.setMembers,
        addMember: state.addMember,

        getSocket: state.getSocket,
        getIsHost: state.getIsHost,
        getRoom: state.getRoom,
    }), []))
    const members = useStore(state => state.members)

    const history = useHistory()
    const { room } = useParams<RouteParams>()

    useEffect(() => {
        if(getRoom() === ""){
            setRoom(room)
            const socket = io("/")
            setSocket(socket)
            socket.on("members in this room", (membersInThisRoom: string[]) => {
                setMembers(membersInThisRoom)
            })
            socket.emit("join room", room)
            socket.on("game started", () => {
                history.replace("/playground")
            })
        }
        getSocket().on("new member", (socketID: string) => {
            addMember(socketID)
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
            <button onClick={startGame} disabled={!(getIsHost() && members.length > 1)}>Start game</button>
        </>
    )
}

export default Lobby