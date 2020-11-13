import React, { useRef, useCallback, useState, useEffect } from 'react';
import useStore from '../zustand/store';

type Props = {
    myTurn: boolean
}

type Message = {
    sender: string
    message: string
    color: string
}

const Chatbox: React.FC<Props> = ({ myTurn }) => {
    const guess = useRef<string>("")
    const [chats, setChats] = useState<Array<Message>>([])

    const { getSocket } = useStore(useCallback(state => ({
        getSocket: state.getSocket
    }), []))

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        const socket = getSocket()
        socket.on("guesses", (message: Message) => {
            setChats(chats => [...chats, message])
        })
    }

    const submitGuess = () => { 
        getSocket().emit("guess", guess.current)
        // setChats(chats => [...chats, {
        //     sender: 'You',
        //     message: guess.current,
        //     color: '#000'
        // }])
    }

    return (
        <>
            <div style={{ backgroundColor: '#ccc', height: '100%', overflowY: 'scroll' }}>
                {chats.map(chat => (
                    <p style={{ color: chat.color }}>{chat.message}</p>
                ))}
            </div>
            {myTurn && <div>
                <input onChange={e => {
                    guess.current = e.target.value
                }} />
                {guess.current !== "" && <button onClick={submitGuess}>submit</button>}
            </div>}
            
        </>
    )
}

export default Chatbox