import React, { useEffect, useCallback } from 'react';
import useStore from '../zustand/store';
import SketchBoard from '../components/SketchBoard';
import { useHistory } from 'react-router-dom';

const Playground: React.FC = (props) => {
    const history = useHistory()

    const { getRoom } = useStore(useCallback(state => ({
        getRoom: state.getRoom
    }), []))

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        if(getRoom() === ""){
            history.replace("/")
            return
        }
    }

    return (
        <>
            <h1>Playground</h1>
            <SketchBoard />
        </>
    )
}

export default Playground