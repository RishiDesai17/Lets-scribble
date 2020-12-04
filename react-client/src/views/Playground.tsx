import React, { useEffect, useCallback, useRef, useState } from 'react';
import useStore from '../zustand/store';
import SketchBoard from '../components/SketchBoard';
import Palette from '../components/Palette';
import Chatbox from '../components/Chatbox';
import { Grid, Button, Drawer } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import './styles/Playground.css';

const Playground: React.FC = (props) => {
    const color = useRef<string>("")

    const [myTurn, setMyTurn] = useState<boolean>(false)
    const [chatDrawer, setChatDrawer] = useState<boolean>(false)
    const [smallScreenView, setSmallScreenView] = useState<boolean>(false)

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
        layoutHandler()
        window.addEventListener("resize", layoutHandler)
    }

    const layoutHandler = () => {
        const screenWidth = window.outerWidth
        setSmallScreenView(smallScreenView => {
            if(smallScreenView && screenWidth >= 960){
                return false
            }
            else if(!smallScreenView && screenWidth < 960){
                return true
            }
            return smallScreenView
        })
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
                <Grid item md={2} sm={2} xs={12}>
                    {members.map(member => (
                        <>
                            <p>{member.memberDetails.name}</p>
                            <img style={{ width: 46, borderRadius: 23 }} src={`/images/avatar_${member.memberDetails.avatar}.jpg`} />
                        </>
                    ))}
                </Grid>
                <Grid item md={8} sm={10} xs={12}>
                    <SketchBoard getColor={getColor} setMyTurn={setMyTurn} myTurn={myTurn} />
                    {myTurn && <Palette setColorInParent={setColor} />}
                </Grid>
                {!smallScreenView && 
                    <Grid item md={2} sm={3} xs={6}>
                        <Chatbox myTurn={myTurn} />
                    </Grid>
                }
            </Grid>
            {smallScreenView && 
                <div>
                    <Button id="drawerButton" onClick={() => setChatDrawer(true)}>
                        <svg width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M14 0a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                        </svg>
                    </Button>
                    <Drawer anchor="right" open={chatDrawer} onClose={() => setChatDrawer(false)}>
                        <div id="drawerChatbox">
                            <Chatbox myTurn={myTurn} />
                        </div>
                    </Drawer>
                </div>
            }
        </>
    )
}

export default Playground