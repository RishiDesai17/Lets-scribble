import React, { useState, useEffect } from 'react';
import useStore from '../zustand/store';
import './styles/Score.css';

const Word: React.FC = (props) => {
    const [score, setScore] = useState<number>(0)

    const getSocket = useStore(state => state.getSocket)

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        const socket = getSocket()
        socket.on("your score", (score: number) => {
            setScore(currentScore => (currentScore + score)) // increment score
        })
    }

    return (
        <p id="score">Score: <b>{score}</b></p>
    )
}

export default Word