import React, { useState, useEffect, useCallback } from 'react';
import useStore from '../zustand/store';
import { Card, CardContent } from '@material-ui/core';
import './styles/ScoreCard.css';

type Member = {
    socketID: string
    memberDetails: {
        name: string
        avatar: number
    }
    score: number
}

const ScoresList: React.FC = (props) => {
    const { members, setMembers, getSocket } = useStore(useCallback(state => ({
        members: state.members,
        setMembers: state.setMembers,
        getSocket: state.getSocket
    }), []))

    const [smallScreen, setSmallScreen] = useState<boolean>(false)

    useEffect(() => {
        init()
        scoreCardLayout()
        window.addEventListener("resize", scoreCardLayout)
        return () => {
            window.removeEventListener("resize", scoreCardLayout)
        }
    }, [])

    const init = () => {
        const socket = getSocket()
        socket.on("updated scores", (members: Member[]) => {
            setMembers(members)
        })
    }

    const scoreCardLayout = () => {
        const screenWidth = window.outerWidth
        setSmallScreen(smallScreen => {
            if(smallScreen && screenWidth >= 960){
                return false
            }
            else if(!smallScreen && screenWidth < 960){
                return true
            }
            return smallScreen
        })
    }

    return (
        <div id="scoreCardContainer">
            <Card id="scoreCard">
                {members.length > 0 && <CardContent id="scoreCardContent">
                    {members.map((member, index) => {
                        if(smallScreen) {
                            return (
                                <div className="scoreCardSmallScreen">
                                    <p className="scoreCardName">{member.memberDetails.name}</p>
                                    <img className="scoreCardAvatar" src={`/images/avatar_${member.memberDetails.avatar}.jpg`} />
                                    <p className="score"><b>{member.score}</b></p>
                                </div>
                            )
                        }
                        else {
                            return (
                                <>
                                    <div className="scoreCardBigScreen">
                                        <b>#{index + 1}</b>
                                        <img className="scoreCardAvatar" src={`/images/avatar_${member.memberDetails.avatar}.jpg`} />
                                        <div>
                                            <p className="scoreCardName">{member.memberDetails.name}</p>
                                            <p className="score">Score: <b>{member.score}</b></p>
                                        </div>
                                    </div> 
                                    {index !== (members.length - 1) && <hr />}
                                </>
                            )
                        }
                    })}
                </CardContent>}
            </Card>
        </div>
    )
}

export default React.memo(ScoresList)