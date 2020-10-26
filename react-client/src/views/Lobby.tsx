import React, { useCallback } from 'react';
import useStore from '../zustand/store';
import { useHistory } from 'react-router-dom';

const Lobby: React.FC = (props) => {
    const { getRoom } = useStore(useCallback(state => ({
        getRoom: state.getRoom
    }), []))

    const history = useHistory()

    const startGame = () => {
        history.replace("/playground")
    }

    return (
        <>
            <h1>Lobby</h1>
            <h4>{getRoom()}</h4>
            <button onClick={startGame}>Start game</button>
        </>
    )
}

export default Lobby