import React, { useState, useCallback, useEffect } from 'react';
import useStore from '../zustand/store';
import { useHistory, useParams } from 'react-router-dom';
import io from 'socket.io-client';

type RouteParams = {
    room: string
}

const Lobby: React.FC = (props) => {
    const { isHost, setSocket, setRoom, setMembers, addMember, removeMember, setIsHost, reset, getSocket, getRoom } = useStore(useCallback(state => ({
        isHost: state.isHost,
        
        setSocket: state.setSocket,
        setRoom: state.setRoom,
        setMembers: state.setMembers,
        addMember: state.addMember,
        removeMember: state.removeMember,
        setIsHost: state.setIsHost,
        reset: state.reset,

        getSocket: state.getSocket,
        getRoom: state.getRoom
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
            
            socket.on("new host", () => {
                setIsHost(true)
            })
        }

        getSocket().on("game over", () => {
            alert("game over")
            getSocket().disconnect()
            reset()
            history.replace("/")
        })

        getSocket().on("new member", (socketID: string) => {
            addMember(socketID)
        })

        getSocket().on("someone left", (socketID: string) => {
            removeMember(socketID)
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
            <button onClick={startGame} disabled={!(isHost && members.length > 1)}>Start game</button>
        </>
    )
}

export default Lobby