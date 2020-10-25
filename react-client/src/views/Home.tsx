import React, { useCallback } from 'react';
import useStore from '../zustand/store';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';

const Home: React.FC = (props) => {
    const { setSocket } = useStore(useCallback(state => ({
        setSocket: state.setSocket
    }), []))

    const history = useHistory();

    const createRoom = () => {
        const userSocket = io("/")
        setSocket(userSocket)
        history.replace("/playground")
    }

    return (
        <>
            <h1>Home</h1>
            <button onClick={createRoom}>Create Private Room</button>
        </>
    )
}

export default Home