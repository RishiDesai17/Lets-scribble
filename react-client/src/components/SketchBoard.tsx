import React, { useRef, useEffect, useCallback, useState, memo } from 'react';
import useStore from '../zustand/store';
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import './styles/SketchBoard.css';

type Coordinates = {
    x: number
    y: number
}

type Member = {
    socketID: string
    name: string
}

type HandleEventTypeProps = {
    e: MouseEvent | TouchEvent
    toDraw: boolean
    setPosition: boolean
}

type ReceiveStrokesProps = {
    newCoordinates: Coordinates
    currentCoordinates: Coordinates
    color: string
}

type Props = {
    getColor: () => string
    myTurn: boolean
    setMyTurn: (turn: boolean) => void
}

const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
}));

const Sketchboard: React.FC<Props> = ({ getColor, myTurn, setMyTurn }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const isDrawing = useRef<boolean>(false)
    const position = useRef<Coordinates>({ x: 0, y: 0 })
    const previousStrokeSent = useRef<number>(new Date().getTime())
    const wordChoices = useRef<Array<string>>([])

    const [open, setOpen] = useState<boolean>(false);
    
    const classes = useStyles();

    const { getSocket } = useStore(useCallback(state => ({
        getSocket: state.getSocket
    }), []))

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        if(!canvasRef.current){
            return
        }
        const socket = getSocket()
        socket.on("receiveStrokes", ({ newCoordinates, currentCoordinates, color }: ReceiveStrokesProps) => {
            draw(newCoordinates, color, currentCoordinates)
        })
        socket.on("turn", (words: string[]) => {
            wordChoices.current = words
            setMyTurn(true)
            setOpen(true)
        })
        socket.on("someone choosing word", (member: Member) => {
            console.log(member)
        })
        socket.on("start guessing", (word: string) => {
            alert("start guessin'")
        })
        attachEventListeners()
    }

    const attachEventListeners = (): void => {
        const canvas = canvasRef.current

        canvas?.addEventListener('mousedown',  onMouseDown)
        canvas?.addEventListener('mousemove', onMouseMove)
        canvas?.addEventListener('mouseup', onMouseUp)
        canvas?.addEventListener('mouseleave', onMouseUp)

        canvas?.addEventListener('touchstart',  onMouseDown)
        canvas?.addEventListener('touchmove',  onMouseMove)
        canvas?.addEventListener('touchend', onMouseUp)
        canvas?.addEventListener('touchcancel', onMouseUp)
    }

    const onMouseDown = useCallback((e: MouseEvent | TouchEvent): void => {
        console.log("mousedown")
        isDrawing.current = true
        handleEventType({ e, toDraw: false, setPosition: true })
    }, [])

    const onMouseMove = (e: MouseEvent | TouchEvent): void => {
        if(isDrawing.current){
            console.log("mousemove true")
            handleEventType({ e, toDraw: true, setPosition: true })
        }
    }

    const onMouseUp = (e: MouseEvent | TouchEvent): void => {
        console.log("mouseup")
        if(isDrawing.current){
            isDrawing.current = false
            handleEventType({ e, toDraw: true, setPosition: false })
        }
    }

    const handleEventType = ({ e, toDraw, setPosition }: HandleEventTypeProps): void => {
        if(!canvasRef.current){
            return
        }
        let coordinates: Coordinates
        if(e instanceof MouseEvent){
            coordinates = {
                x: e.pageX - canvasRef.current.offsetLeft,
                y: e.pageY - canvasRef.current.offsetTop
            }
            console.log(coordinates, canvasRef.current.offsetTop, canvasRef.current.offsetLeft)
        }
        else{
            coordinates = {
                x: e.changedTouches[0].clientX - canvasRef.current.offsetLeft,
                y: e.changedTouches[0].clientY - canvasRef.current.offsetTop
            }
            console.log(coordinates)
        }
        if(toDraw){
            const color = getColor()
            draw({
                x: coordinates.x,
                y: coordinates.y
            }, color)
            const now = new Date().getTime()
            if(now - previousStrokeSent.current > 12){
                getSocket().emit("drawing", { 
                    newCoordinates: coordinates, 
                    currentCoordinates: {
                        x: position.current?.x,
                        y: position.current?.y
                    },
                    color
                })
            }
            previousStrokeSent.current = now
        }
        if(setPosition){
            position.current = coordinates
        }
    }

    const draw = ({ x: newX, y: newY }: Coordinates, color: string, currentCoordinates?: Coordinates): void => {
        const currentContext = canvasRef.current?.getContext('2d')
        if(!currentContext){
            return
        }
        currentContext.lineWidth = 2
        currentContext.strokeStyle = color
        currentContext.beginPath();
        
        if(currentCoordinates){
            currentContext.moveTo(currentCoordinates.x, currentCoordinates.y);
        }
        else{
            currentContext.moveTo(position.current.x, position.current.y);
        }
        currentContext.lineTo(newX, newY);
        
        currentContext.closePath();
        currentContext.stroke();
    }

    const chooseWord = (choice: string) => {
        const socket = getSocket()
        socket.emit("chosen word", choice)
        setTimeout(() => {
            socket.emit("next turn")
        }, 5 * 1000)
        setOpen(false)
    }

    return (
        <>
            <div id="canvasContainer">
                <canvas height={500} width={500} ref={canvasRef} style={{ pointerEvents: myTurn ? 'auto' : 'none' }}></canvas>
            </div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Transition modal</h2>
                        <p id="transition-modal-description">
                            react-transition-group animates me.
                        </p>
                        {wordChoices.current.map(word => (
                            <button onClick={() => chooseWord(word)}>{word}</button>
                        ))}
                    </div>
                </Fade>
            </Modal>
        </>
    )
}

export default memo(Sketchboard)