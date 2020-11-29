import React, { useState, useCallback, useEffect, useRef } from 'react';
import useStore from '../zustand/store';
import GameSettings from '../components/GameSettings';
import ModalBody from '../components/ModalBody';
import { Modal, Backdrop, Fade, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useHistory, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { toast } from "react-toastify";
import './styles/Lobby.css';
import LobbyMembers from '../components/LobbyMembers';

type RouteParams = {
    room: string
}

type Member = {
    socketID: string
    memberDetails: {
        name: string
        avatar: number
    }
}

type Settings = {
    round_length: number, 
    numRounds: number
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        paper: {
            backgroundColor: "#f5f5f5",
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3)
        }
    }),
);

const Lobby: React.FC = (props) => {
    const { isHost, setSocket, setRoom, setName, setMembers, addMember, removeMember, setIsHost, reset, getSocket, getRoom, getName } = useStore(useCallback(state => ({
        isHost: state.isHost,
        
        setSocket: state.setSocket,
        setRoom: state.setRoom,
        setName: state.setName,
        setMembers: state.setMembers,
        addMember: state.addMember,
        removeMember: state.removeMember,
        setIsHost: state.setIsHost,
        reset: state.reset,

        getSocket: state.getSocket,
        getRoom: state.getRoom,
        getName: state.getName
    }), []))
    const members = useStore(state => state.members)

    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const avatarRef = useRef<number>(0)

    const history = useHistory()
    const { room } = useParams<RouteParams>()

    const classes = useStyles();

    useEffect(() => {
        if(getRoom() === ""){
            setRoom(room)

            if(getName() === ""){
                setModalOpen(true)
            }
            else{
                init()
            }
        }
        else{
            sharedSocketFns()
        }
    }, [])

    const init = () => {
        const socket = io("/")
        setSocket(socket)
        
        socket.on("members in this room", (membersInThisRoom: Member[]) => {
            setMembers(membersInThisRoom)
        })

        socket.emit("join room", { 
            roomID: room, 
            name: getName(), 
            avatar: avatarRef.current + 1 
        })

        socket.on("game started", () => {
            history.replace("/playground")
        })
        
        socket.on("new host", () => {
            setIsHost(true)
        })

        socket.on("invalid room", () => {
            toast.error('Invalid Room', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            history.replace("/")
        })
    }

    const sharedSocketFns = () => {
        const socket = getSocket()

        socket.on("game over", () => {
            toast.info('Game over', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            socket.disconnect()
            reset()
            history.replace("/")
        })

        socket.on("new member", (member: Member) => {
            addMember(member)
        })

        socket.on("someone left", (member: string) => {
            removeMember(member)
        })

        socket.on("something broke", () => {
            toast.error('Something went wrong, please try again later', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        })
    }

    const modalHandler = (name: string) => {
        setName(name)
        setModalOpen(false)
        init()
        sharedSocketFns()
    }

    const startGame = ({ round_length, numRounds }: Settings) => {
        getSocket().emit("start game", {
            round_length,
            numRounds
        })
        history.replace("/playground")
    }

    return (
        <div id="lobbyBackground">
            <h1 id="lobbyTitle">Lobby</h1>
            <Grid container>
                {isHost && 
                    <Grid item md={4} sm={4} xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <GameSettings numMembers={members.length} startGame={startGame} />
                    </Grid>
                }
                <Grid item md={isHost ? 8 : 12} sm={isHost ? 8 : 12} xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <LobbyMembers members={members} isHost={isHost} socketID={getSocket().id} />
                </Grid>
            </Grid>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={modalOpen}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Fade in={modalOpen}>
                    <div className={classes.paper}>
                        <ModalBody modalHandler={modalHandler} avatarRef={avatarRef} />
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default Lobby