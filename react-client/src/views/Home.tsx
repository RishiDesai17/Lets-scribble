import React, { useCallback, useRef, useState } from 'react';
import Avatars from '../components/Avatars';
import useStore from '../zustand/store';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import { Card, CardContent, TextField, Button, Grid, CircularProgress } from '@material-ui/core';
import { toastError } from '../components/Toast';
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
    const [buttonDisabled, setButtonDisabled] = useState< -1 | 0 | 1 >(-1) // 0 -> create room, 1 -> join room, -1 -> none
    const history = useHistory();

    const createRoom = () => {
        setButtonDisabled(0)
        const name = getName()
        const avatar = getAvatar()
        if(!nameValidation(name)){
            setButtonDisabled(-1)
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
                },
                score: 0
            }])
            history.replace(`/lobby/${roomID}`)
            setButtonDisabled(-1)
        })
        socket.emit("create room", { host_name: name, avatar: avatar + 1 })
    }

    const join = () => {
        setButtonDisabled(0)
        const name = getName()
        if(!nameValidation(name)){
            setButtonDisabled(-1)
            return
        }
        let { protocol, hostname, port } = window.location
        if(window.location.port !== ""){
            hostname += ":" + port
        }
        const urlRegex = new RegExp(`^${protocol}\/\/${hostname}\/lobby\/([a-z0-9\-])\/?`)
        if(!urlRegex.test(room.current)){
            toastError("Enter valid room URL")
            setButtonDisabled(-1)
            return
        }
        const roomID = room.current.split("/")[4]
        history.replace(`/lobby/${roomID}`)
        setButtonDisabled(-1)
    }

    const nameValidation = (name: string) => {
        if(name === ""){
            toastError('Please enter a name')
            return false
        }
        else if(name.length < 3 || name.length > 15){
            toastError('Name should be 3-15 characters long')
            return false
        }
        return true
    }

    return (
        <div id="home-background">
            <h1 id="title">LETS SCRIBBLE</h1>
            <div id="card-container">
                <Card id="main-card">
                    <CardContent>
                        <form noValidate autoComplete="off">
                            <div id="name-input-container">
                                <TextField id="filled-basic" label="Enter Name" variant="filled" defaultValue={getName()} onChange={e => setName(e.target.value.trim())} />
                            </div>
                            <Avatars />
                            <div id="buttons-container">
                                <Grid container>
                                    <Grid item md={5} sm={12} xs={12}>
                                        <Button id="create-room-button" variant="contained" color="primary" disabled={buttonDisabled !== -1} onClick={createRoom}>
                                            {buttonDisabled === 0 ? 
                                                <CircularProgress size={25} /> 
                                            : 
                                                "Create Private Room"
                                            }
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
                                            <Button variant="contained" disabled={buttonDisabled !== -1} onClick={join}>
                                                {buttonDisabled === 1 ? 
                                                    <CircularProgress size={25} /> 
                                                : 
                                                    "Join"
                                                }
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