import React, { useCallback } from 'react';
import useStore from '../zustand/store';
import useGameStore from '../zustand/game';
import useChatsStore from '../zustand/chats';
import GuessInput from './GuessInput';
import { Card, CardContent } from '@material-ui/core';
import './styles/Chatbox.css';

const Chatbox: React.FC = () => {
    const getSocket = useStore(useCallback(state => state.getSocket, []))

    const myTurn = useGameStore(useCallback(state => state.myTurn, []))

    const chats = useChatsStore(useCallback(state => state.chats, []))

    const submitGuess = (e: React.FormEvent, guess: string) => { 
        e.preventDefault()
        getSocket().emit("guess", guess)
    }

    return (
        <Card>
            <CardContent id="chatboxContainer">
                <div id="chatbox" style={{ height: myTurn ? '100%' : '85%' }}>
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