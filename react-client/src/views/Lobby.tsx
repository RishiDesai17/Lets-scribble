import React, { useState, useCallback, useEffect, useRef } from 'react';
import useStore from '../zustand/store';
import useGameStore from '../zustand/game';
import GameSettings from '../components/GameSettings';
import LobbyMembers from '../components/LobbyMembers';
import ModalBody from '../components/ModalBody';
import ShareLink from '../components/ShareLink';
import { generateUnderscores } from '../components/Word';
import { Modal, Backdrop, Fade, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useHistory, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { toastError } from "../components/Toast";
import './styles/Lobby.css';

type RouteParams = {
    room: string
}

type Member = {
    socketID: string
    memberDetails: {
        name: string
        avatar: number
    }
    score: number
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
    const { 
        isHost, 
        members,
        
        setSocket,
        setRoom,
        setMembers,
        addMember,
        removeMember,
        setIsHost,
        
        getSocket,
        getRoom,
        getName,
        getAvatar
        
    } = useStore(useCallback(state => ({
        isHost: state.isHost,
        members: state.members,
        
        setSocket: state.setSocket,
        setRoom: state.setRoom,
        setMembers: state.setMembers,
        addMember: state.addMember,
        removeMember: state.removeMember,
        setIsHost: state.setIsHost,

        getSocket: state.getSocket,
        getRoom: state.getRoom,
        getName: state.getName,
        getAvatar: state.getAvatar
    }), []))

    const { setSelectedWord, setRoundLength, startCountdown } = useGameStore(useCallback(state => ({ 
        setSelectedWord: state.setSelectedWord,
        setRoundLength: state.setRoundLength,
        startCountdown: state.startCountdown
    }), []))

    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const history = useHistory()
    const { room } = useParams<RouteParams>()

    const classes = useStyles();

    useEffect(() => {
        if(getRoom() === ""){
            setRoom(room)

            if(!getSocket().id && getName() === ""){
                setModalOpen(true)
            }
            else{
                nonHostSocketFns()
                socketFns()
            }
        }
        else{
            socketFns()
        }
    }, [])

    const nonHostSocketFns = () => {
        const socket = io("/")
        setSocket(socket)
        
        socket.on("members in this room", (membersInThisRoom: Member[], roundDetails?: { wordLength: number, startTime: string, round_length: number }) => {
            setMembers(membersInThisRoom)
            if(roundDetails){
                const { wordLength, startTime, round_length } = roundDetails
                setRoundLength(round_length)
                if(wordLength === 0){
                    history.replace("/playground")
                    return
                }
                startCountdown(startTime)
                const underscores = generateUnderscores(wordLength)
                setSelectedWord(underscores)
                history.replace("/playground")
            }
        })

        socket.emit("join room", { 
            roomID: room, 
            name: getName(), 
            avatar: getAvatar() + 1
        })

        socket.on("game started", (round_length: number) => {
            setRoundLength(round_length)
            history.replace("/playground")
        })
        
        socket.on("new host", () => {
            setIsHost(true)
        })

        socket.on("invalid room", () => {
            toastError('Invalid Room')
            socket.disconnect()
            setRoom("")
            history.replace("/")
        })
    }

    const socketFns = () => {
        const socket = getSocket()

        socket.on("new member", (member: Member) => {
            addMember(member)
        })

        socket.on("someone left", (member: string) => {
            removeMember(member)
        })

        socket.on("something broke", () => {
            toastError('Something went wrong, please try again later')
        })
    }

    const modalHandler = () => {
        setModalOpen(false)
        nonHostSocketFns()
        socketFns()
    }

    const startGame = ({ round_length, numRounds }: Settings) => {
        if(members.length > 1) {
            getSocket().emit("start game", {
                round_length,
                numRounds
            })
            history.replace("/playground")
        }
    }

    return (
        <div id="lobbyBackground">
            <h1 id="lobbyTitle">Lobby</h1>
            <ShareLink />
            <Grid container>
                {isHost && 
                    <Grid item md={4} sm={4} xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <GameSettings numMembers={members.length} startGame={startGame} />
                    </Grid>
                }
                <Grid item md={isHost ? 8 : 12} sm={isHost ? 8 : 12} xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    {getName() !== "" && !modalOpen && <LobbyMembers members={members} isHost={isHost} socketID={getSocket().id} />}
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
                        <ModalBody modalHandler={modalHandler} />
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default Lobby