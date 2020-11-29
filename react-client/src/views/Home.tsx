import React, { useCallback, useRef } from 'react';
import Avatars from '../components/Avatars';
import useStore from '../zustand/store';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import { Card, CardContent, TextField, Button, Grid } from '@material-ui/core';
import { toast } from 'react-toastify';
import "./styles/Home.css";

const Home: React.FC = (props) => {
    const { setSocket, setRoom, setName, setIsHost, setMembers, getName, getAvatar } = useStore(useCallback(state => ({
        setSocket: state.setSocket,
        setRoom: state.setRoom,
        setName: state.setName,
        setIsHost: state.setIsHost,
        setMembers: state.setMembers,

        getName: state.getName,
        getAvatar: state.getAvatar
    }), []))

    const room = useRef<string>("")
    const history = useHistory();

    const createRoom = () => {
        const name = getName()
        const avatar = getAvatar()
        if(name === ""){
            toastError('Please enter a name')
            return
        }
        if(name.length < 3 || name.length > 15){
            toastError('Name should be 3-15 characters long')
            return
        }
        const socket = io("/")
        setSocket(socket)
        socket.on("roomID", (roomID: string) => {
            setRoom(roomID)
            setIsHost(true)
            setMembers([{ 
                socketID: socket.id, 
                memberDetails: { 
                    name,
                    avatar: avatar + 1
                }
            }])
            history.replace(`/lobby/${roomID}`)
        })
        socket.emit("create room", { host_name: name, avatar: avatar + 1 })
    }

    const join = () => {
        const urlRegex = /^(http)s?:\/\/localhost:3000\/lobby\/([a-z0-9\-])\/?/
        if(!urlRegex.test(room.current)){
            toastError("Enter valid room URL")
            return
        }
        const roomID = room.current.split("/")[4]
        history.replace(`/lobby/${roomID}`)
    }

    const toastError = (message: string) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 2000,
            closeOnClick: true,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true
        });
    }

    return (
        <div id="home-background">
            <h1 id="title">LETS SCRIBBLE</h1>
            <div id="card-container">
                <Card id="main-card">
                    <CardContent>
                        <form noValidate autoComplete="off">
                            <div id="name-input-container">
                                <TextField id="filled-basic" label="Enter Name" variant="filled" defaultValue={getName()} onChange={e => setName(e.target.value)} />
                            </div>
                            <Avatars />
                            <div id="buttons-container">
                                <Grid container>
                                    <Grid item md={5} sm={12} xs={12}>
                                        <Button id="create-room-button" variant="contained" color="primary" onClick={createRoom}>
                                            Create Private Room
                                        </Button>
                                    </Grid>
                                    <Grid item md={2} sm={12} xs={12} id="or">OR</Grid>
                                    <Grid item md={5} sm={12} xs={12} justify="center">
                                        <div style={{ marginTop: -3 }}>
                                            <TextField label="Enter Room URL" variant="outlined" style={{ margin: '0 8px 10px 0' }} 
                                                inputProps={{
                                                    style: {
                                                        height: 7
                                                    },
                                                }} 
                                                InputLabelProps={{
                                                    style: {
                                                        top: -6
                                                    },
                                                }} 
                                                onChange={e => {
                                                    room.current = e.target.value
                                                }} 
                                            />
                                            <Button variant="contained" onClick={join}>
                                                Join
                                            </Button>    
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Home