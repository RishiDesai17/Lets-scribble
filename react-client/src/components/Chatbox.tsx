import React, { useCallback, useRef, useEffect } from 'react';
import useStore from '../zustand/store';
import useGameStore from '../zustand/game';
import useChatsStore from '../zustand/chats';
import GuessInput from './GuessInput';
import { Card, CardContent } from '@material-ui/core';
import './styles/Chatbox.css';

type Message = {
    socketID: string
    sender: string
    message: string
    color: string
}

const Chatbox: React.FC = () => {
    const getSocket = useStore(useCallback(state => state.getSocket, []))

    const myTurn = useGameStore(useCallback(state => state.myTurn, []))

    const { chats, addChat } = useChatsStore(useCallback(state => ({ 
        chats: state.chats,
        addChat: state.addChat
    }), []))

    const chatboxRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        const socket = getSocket()
        socket.on("guesses", (message: Message) => {
            addChat(message)
            if(!chatboxRef.current) return
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
        })
    }

    const submitGuess = (e: React.FormEvent, guess: string) => { 
        e.preventDefault()
        getSocket().emit("guess", guess)
    }

    return (
        <Card>
            <CardContent id="chatboxContainer">
                <div id="chatbox" ref={chatboxRef} style={{ height: myTurn ? '100%' : '85%' }}>
                    {chats.map((chat, index) => (
                        <div className="guessContainer" key={index}>
                            <p style={{ color: chat.color }}><b>{chat.socketID === getSocket().id ? "You" : chat.sender}</b>{": " + chat.message}</p>
                        </div>
                    ))}
                </div>
                {!myTurn && 
                    <div>
                        <GuessInput submitGuess={submitGuess} />
                    </div>
                }
            </CardContent>
        </Card>
    )
}

export default React.memo(Chatbox)