import React, { useCallback } from 'react';
import useGameStore from '../zustand/game';

const Timer: React.FC = () => {
    const timeRemaining = useGameStore(useCallback(state => state.timeRemaining, []))

    const displayTime = () => {
        const minutes = Math.floor(timeRemaining / 60)
        let seconds: number|string = (timeRemaining - (minutes * 60))
        if(seconds < 10){
            seconds = "0" + seconds.toString()
        }
        return `${minutes}:${seconds}`
    }

    return (
        <span style={{ fontSize: 25, marginLeft: 6 }}>{displayTime()}</span>
    )
}

export default Timer