import React, { useCallback, useRef } from 'react';
import Avatars from '../components/Avatars';
import useStore from '../zustand/store';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import { Card, CardContent, TextField, Button } from '@material-ui/core';
import "./styles/Home.css";

const Home: React.FC = (props) => {
    const { setSocket, setRoom, setName, setIsHost, setMembers, getName } = useStore(useCallback(state => ({
        setSocket: state.setSocket,
        setRoom: state.setRoom,
        setName: state.setName,
        setIsHost: state.setIsHost,
        setMembers: state.setMembers,

        getName: state.getName
    }), []))

    const history = useHistory();

    const createRoom = (e: React.FormEvent) => {
        e.preventDefault()
        if(getName() === ""){
            alert("Please enter a name")
            return
        }
        const socket = io("/")
        setSocket(socket)
        const name = getName()
        socket.on("roomID", (roomID: string) => {
            setRoom(roomID)
            setIsHost(true)
            setMembers([{ socketID: socket.id, name }])
            history.replace(`/lobby/${roomID}`)
        })
        socket.emit("create room", name)
    }

    return (
        <div id="home-background">
            <h1 id="title">LETS SCRIBBLE</h1>
            <div id="card-container">
                <Card id="main-card">
                    <CardContent>
                        {/* <h1 id="title">Hey!</h1> */}
                        <form noValidate autoComplete="off" onSubmit={e => createRoom(e)}>
                            <div id="name-input-container">
                                <TextField id="filled-basic" label="Enter Name" variant="filled" onChange={e => {
                                    setName(e.target.value)
                                }} />
                            </div>
                            <Button type="submit" variant="contained" color="primary">
                                Create Private Room
                            </Button>
                        </form>
                        <Avatars />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Home