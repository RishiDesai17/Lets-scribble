import React, { useEffect, useCallback, useRef, useState } from 'react';
import useStore from '../zustand/store';
import SketchBoard from '../components/SketchBoard';
import Palette from '../components/Palette';
import Chatbox from '../components/Chatbox';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';

const Playground: React.FC = (props) => {
    const color = useRef<string>("")

    const [myTurn, setMyTurn] = useState<boolean>(false)

    const members = useStore(state => state.members)

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
            <Grid container>
                <Grid item md={2} sm={2} xs={1}>
                    {members.map(Member => (
                        <>
                            <p>{Member.member.name}</p>
                            <img src={`/images/avatar_${Member.member.avatar}.jpg`} />
                        </>
                    ))}
                </Grid>
                <Grid item md={8} sm={10} xs={11}>
                    <SketchBoard getColor={getColor} setMyTurn={setMyTurn} myTurn={myTurn} />
                    {myTurn && <Palette setColorInParent={setColor} />}
                </Grid>
                <Grid item md={2} sm={12} xs={12}>
                    <Chatbox myTurn={myTurn} />
                </Grid>
            </Grid>
        </>
    )
}

export default Playground