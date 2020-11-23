import React, { useState, useCallback, useEffect } from 'react';
import useStore from '../zustand/store';
import { useHistory, useParams } from 'react-router-dom';
import io from 'socket.io-client';

type RouteParams = {
    room: string
}

type Member = {
    socketID: string
    name: string
}

const Lobby: React.FC = (props) => {
    const { isHost, setSocket, setRoom, setName, setMembers, addMember, removeMember, setIsHost, reset, getSocket, getRoom, getName } = useStore(useCallback(state => ({
        isHost: state.isHost,
        
        setSocket: state.setSocket,
        setRoom: state.setRoom,
        setName: state.setName,
        setMembers: state.setMembers,
        addMember: state.addMember,
        removeMember: state.removeMember,
        setIsHost: state.setIsHost,
        reset: state.reset,

        getSocket: state.getSocket,
        getRoom: state.getRoom,
        getName: state.getName
    }), []))
    const members = useStore(state => state.members)

    const history = useHistory()
    const { room } = useParams<RouteParams>()

    useEffect(() => {
        if(getRoom() === ""){
            setRoom(room)
            
            if(getName() === ""){
                let name = null
                while(name === null){
                    name = prompt("Please enter your name")
                }
                setName(name)
            }

            const socket = io("/")
            setSocket(socket)
            
            socket.on("members in this room", (membersInThisRoom: Member[]) => {
                setMembers(membersInThisRoom)
            })

            socket.emit("join room", { room, name: getName() })

            socket.on("game started", () => {
                history.replace("/playground")
            })
            
            socket.on("new host", () => {
                setIsHost(true)
            })

            socket.on("invalid room", () => {
                alert("Invalid room")
                history.replace("/")
            })
        }

        const socket = getSocket()

        socket.on("game over", () => {
            alert("game over")
            socket.disconnect()
            reset()
            history.replace("/")
        })

        socket.on("new member", (member: Member) => {
            addMember(member)
        })

        socket.on("someone left", (member: string) => {
            removeMember(member)
        })

        socket.on("something broke", () => {
            alert("Something went wrong, please try again later")
        })
    }, [])

    const startGame = () => {
        getSocket().emit("start game", {
            numRounds: 1,
            round_length: 60
        })
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