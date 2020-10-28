import React, { useEffect, useCallback, useRef } from 'react';
import useStore from '../zustand/store';
import SketchBoard from '../components/SketchBoard';
import { useHistory } from 'react-router-dom';
import Palette from '../components/Palette';

const Playground: React.FC = (props) => {
    const color = useRef<string>("")
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

    const setColor = (selectedColor: string) => {
        color.current = selectedColor
    }

    const getColor = () => {
        return color.current
    }

    return (
        <>
            <h1>Playground</h1>
            <SketchBoard getColor={getColor} />
            <Palette setColorInParent={setColor} />
        </>
    )
}

export default Playground