import React, { useEffect, useCallback, useRef, useState } from 'react';
import useStore from '../zustand/store';
import useGameStore from '../zustand/game';
import SketchBoard from '../components/SketchBoard';
import Palette from '../components/Palette';
import ScoreCard from '../components/ScoreCard';
import Chatbox from '../components/Chatbox';
import GameBar from '../components/GameBar';
import ShareLink from '../components/ShareLink';
import { Grid, Button, Drawer } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import './styles/Playground.css';

const Playground: React.FC = (props) => {
    const color = useRef<string>("")

    const [chatDrawer, setChatDrawer] = useState<boolean>(false)
    const [smallScreenView, setSmallScreenView] = useState<boolean>(false)

    const getRoom = useStore(useCallback(state => state.getRoom, []))

    const myTurn = useGameStore(useCallback(state => state.myTurn, []))

    const history = useHistory()

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

    if(getRoom() === "") {
        return (
            <p>Redirecting...</p>
        )
    }

    return (
        <div id="playgroundBackground">
            <h1 id="playgroundTitle">Playground</h1>
            <ShareLink />
            <div id="gameBarContainer">
                <div style={{ width: '85%' }}>
                    <GameBar />
                </div>
            </div>
            <Grid container>
                <Grid item md={2} sm={12} xs={12}>
                    <ScoreCard />
                </Grid>
                <Grid item md={8} sm={12} xs={12}>
                    <SketchBoard getColor={getColor} />
                    {myTurn && 
                        <Palette setColorInParent={setColor} />
                    }
                </Grid>
                {!smallScreenView && 
                    <Grid item md={2}>
                        <div style={{ width: '95%' }}>
                            <Chatbox />
                        </div>
                    </Grid>
                }
            </Grid>
            {smallScreenView && 
                <div>
                    <Button id="drawerButton" onClick={() => setChatDrawer(true)}>
                        <svg width="2em" height="2em" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M14 0a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                        </svg>
                    </Button>
                    <Drawer anchor="right" open={chatDrawer} onClose={() => setChatDrawer(false)}>
                        <div id="drawerChatbox">
                            <Chatbox />
                        </div>
                    </Drawer>
                </div>
            }
        </div>
    )
}

export default Playground