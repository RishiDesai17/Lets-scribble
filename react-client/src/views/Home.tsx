import React, { useCallback, useRef } from 'react';
import Avatars from '../components/Avatars';
import useStore from '../zustand/store';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import { Card, CardContent, TextField, Button, Grid } from '@material-ui/core';
import { toast } from 'react-toastify';
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

    const avatarRef = useRef<number>(0);
    const history = useHistory();

    const createRoom = (e: React.FormEvent) => {
        e.preventDefault()
        const name = getName()
        if(name === ""){
            toast.error('Please enter a name', {
                position: "top-center",
                autoClose: 2000,
                closeOnClick: true,
                hideProgressBar: true,
                pauseOnHover: true,
                draggable: true
            });
            return
        }
        const socket = io("/")
        setSocket(socket)
        socket.on("roomID", (roomID: string) => {
            setRoom(roomID)
            setIsHost(true)
            setMembers([{ 
                socketID: socket.id, 
                member: { 
                    name,
                    avatar: avatarRef.current + 1
                }
            }])
            history.replace(`/lobby/${roomID}`)
        })
        socket.emit("create room", { host_name: name, avatar: avatarRef.current + 1 })
    }

    return (
        <div id="home-background">
            <h1 id="title">LETS SCRIBBLE</h1>
            <div id="card-container">
                <Card id="main-card">
                    <CardContent>
                        <form noValidate autoComplete="off" onSubmit={e => createRoom(e)}>
                            <div id="name-input-container">
                                <TextField id="filled-basic" label="Enter Name" variant="filled" onChange={e => {
                                    setName(e.target.value)
                                }} />
                            </div>
                            <Avatars avatarRef={avatarRef} />
                            <Button id="create-room-button" type="submit" variant="contained" color="primary">
                                Create Private Room
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Home