import React from 'react';
import { Card, CardContent, Grid } from '@material-ui/core';
import './styles/LobbyMembers.css'

type Member = {
    socketID: string
    memberDetails: {
        name: string
        avatar: number
    }
    score: number
}

type Props = {
    members: Member[]
    isHost: boolean
    socketID: string
}

const LobbyMembers: React.FC<Props> = ({ members, isHost, socketID }) => {
    return (
        <div style={{ width: isHost ? '85%' : '78%' }}>
            <Card>
                <CardContent>
                    <Grid container id="membersContainer">
                        {members.map(member => (
                            <Grid item md={isHost ? 3 : 2} sm={4} xs={6}>
                                <img src={`/images/avatar_${member.memberDetails.avatar}.jpg`} className="lobbyAvatars" />
                                <p className="memberName" style={{ fontWeight: socketID === member.socketID ? 'bold' : 'normal' }}>{member.memberDetails.name}</p>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )
}

export default LobbyMembers