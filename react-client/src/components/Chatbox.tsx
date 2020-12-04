import React, { useRef, useCallback, useState, useEffect } from 'react';
import useStore from '../zustand/store';
import useChatsStore from '../zustand/chats';
import GuessInput from './GuessInput';
import './styles/Chatbox.css';

type Props = {
    myTurn: boolean
}

type Message = {
    sender: string
    message: string
    color: string
}

const Chatbox: React.FC<Props> = ({ myTurn }) => {
    // const [chats, setChats] = useState<Array<Message>>([])

    const { getSocket } = useStore(useCallback(state => ({
        getSocket: state.getSocket
    }), []))

    const { chats, addChat } = useChatsStore(state => ({
        chats: state.chats,
        addChat: state.addChat
    }))

    useEffect(() => {
        // alert("init")
        const socket = getSocket()
        init(socket)
        return () => {
            socket.off("guesses")
        }
    }, [])

    const init = (socket: SocketIOClient.Socket) => {
        // const socket = getSocket()
        socket.on("guesses", (message: Message) => {
            addChat(message)
        })
    }

    const submitGuess = (e: React.FormEvent, guess: string) => { 
        e.preventDefault()
        getSocket().emit("guess", guess)
    }

    return (
        <div id="chatboxContainer">
            <div id="chatbox">
                {chats.map((chat, index) => (
                    <div className="guessContainer" key={index}>
                        <p style={{ color: chat.color }}><b>{chat.sender === getSocket().id ? "You" : chat.sender}</b>{": " + chat.message}</p>
                    </div>
                ))}
            </div>
            {!myTurn && 
                <div>
                    <GuessInput submitGuess={submitGuess} />
                </div>
            }
        </div>
    )
}

export default React.memo(Chatbox)