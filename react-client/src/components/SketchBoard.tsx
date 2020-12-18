import React, { useRef, useEffect, useCallback, useState, memo } from 'react';
import useStore from '../zustand/store';
import useChatsStore from '../zustand/chats';
import useGameStore from '../zustand/game';
import ChooseWord from './ChooseWord';
import ResultCard from './ResultCard';
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Backdrop, Fade, Collapse, Button } from "@material-ui/core";
import { toastInfo } from './Toast';
import './styles/SketchBoard.css';

type Coordinates = {
    x: number
    y: number
}

type Member = {
    socketID: string
    memberDetails: {
        name: string
        avatar: number
    }
    score: number
}

type Message = {
    socketID: string
    sender: string
    message: string
    color: string
}

type Stroke = {
    newCoordinates: Coordinates 
    currentCoordinates: Coordinates
    color: string
}

type HandleEventTypeProps = {
    e: MouseEvent | TouchEvent
    toDraw: boolean
    setPosition: boolean
}

type Props = {
    getColor: () => string
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

const Sketchboard: React.FC<Props> = ({ getColor }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const isDrawing = useRef<boolean>(false)
    const position = useRef<Coordinates>({ x: 0, y: 0 })
    const strokesBuffer = useRef<Array<Stroke>>([])
    const wordChoices = useRef<Array<string>>([])
    const autoSelectionTimeout = useRef<number>()
    const nextTurnTimeout = useRef<number>()
    const overlayContent = useRef<string | Member[]>("")

    const [canvasSize, setCanvasSize] = useState<number>(500);
    const [overlay, setOverlay] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    
    const classes = useStyles();

    const { getSocket, reset } = useStore(useCallback(state => ({
        getSocket: state.getSocket,
        reset: state.reset
    }), []))

    const { addChat, clearChats } = useChatsStore(useCallback(state => ({
        addChat: state.addChat,
        clearChats: state.clearChats
    }), []))

    const {
        myTurn,
        roundLength,

        setMyTurn,
        setSelectedWord,
        
        getMyTurn,
        getSelectedWord,

        startCountdown,
        resetCountdown,
        resetGameStore
    } = useGameStore(useCallback(state => ({
            myTurn: state.myTurn,
            roundLength: state.roundLength,
            
            setMyTurn: state.setMyTurn,
            setSelectedWord: state.setSelectedWord,
            
            getMyTurn: state.getMyTurn,
            getSelectedWord: state.getSelectedWord,
            
            startCountdown: state.startCountdown,
            resetCountdown: state.resetCountdown,
            resetGameStore: state.resetGameStore
    }), []))

    useEffect(() => {
        init()
        
        const strokeSendingInterval = setInterval(() => {
            sendStrokes()
        }, 100)  // send group of strokes every 100ms instead of every stroke one by one to prevent server overload
        
        return () => {
            window.removeEventListener("resize", canvasSizeHandler)
            clearInterval(strokeSendingInterval)
        }
    }, [])

    const init = () => {
        if(!canvasRef.current){
            return
        }
        const socket = getSocket()
        if(!socket.id) return
        
        socket.on("turn", (words: string[]) => {
            wordChoices.current = words
            autoSelectionTimeout.current = window.setTimeout(autoSelectionHandler, 7500)
            resetCountdown()
            setSelectedWord("")
            setOpen(true)
            setMyTurn(true)
            clearCanvas()
        })
        
        socket.on("someone choosing word", (name: string) => {
            overlayContent.current = `${name} is choosing a word`
            setOverlay(true)
            setMyTurn(false)
            setSelectedWord("")
            clearCanvas()
            /*  Below operations need to be performed if all players have correctly given the answer
                and the next turn is given to the next player, so we need to clear the timeout and countdown.
                Also for resetCountDown, another reason to execute it is 
                just in case latency caused countdown delay of a few seconds
            */
            clearTimeout(nextTurnTimeout.current)
            resetCountdown()
        })
        
        socket.on("start guessing", () => {
            toastInfo('start guessing')
            setOverlay(false)
            startCountdown()
        })

        socket.on("new member", (member: Member) => {
            socket.emit("send full canvas", {
                sourceCanvas: canvasRef.current?.toDataURL('image/jpeg', 0.2),
                recipient: member.socketID
            })
        })

        socket.on("receiveStrokes", (strokes: Stroke[]) => {
            for(let stroke of strokes) {
                const { newCoordinates, currentCoordinates, color } = stroke
                draw(newCoordinates, color, currentCoordinates)
            }
        })
        
        socket.on("full canvas", (sourceCanvas: string) => {
            const canvas = canvasRef.current
            if(!canvas) return
            const currentContext = canvas.getContext('2d')
            if(!currentContext) return
            const canvasImage = new Image()
            canvasImage.onload = () => {
                currentContext.drawImage(canvasImage, 0, 0, canvas.width, canvas.height)
            };
            canvasImage.src = sourceCanvas  
        })

        socket.on("guesses", (message: Message) => {
            addChat(message)
        })
        
        socket.on("game over", (results: Member[]) => {
            toastInfo('Game over')
            overlayContent.current = results
            setOverlay(true) // to display the results
            setOpen(false) // to close modal in case game ended at a point when player was choosing a word
            socket.disconnect() // disonnect from server
            reset() // clear details for this room
            clearChats() // clear the guess chats
            resetGameStore() // clear game data
        })
        
        canvasSizeHandler()
        attachEventListeners()
    }

    useEffect(() => {
        canvasBackground('white')
    }, [canvasSize])

    const attachEventListeners = () => {
        /* for canvas layout handling */
        window.addEventListener("resize", canvasSizeHandler)

        const canvas = canvasRef.current

        /* various canvas drawing events to be listened to for strokes */
        canvas?.addEventListener('mousedown',  onMouseDown)
        canvas?.addEventListener('mousemove', onMouseMove)
        canvas?.addEventListener('mouseup', onMouseUp)
        canvas?.addEventListener('mouseleave', onMouseUp)

        /* for mobile devices */
        canvas?.addEventListener('touchstart',  onMouseDown)
        canvas?.addEventListener('touchmove',  onMouseMove)
        canvas?.addEventListener('touchend', onMouseUp)
        canvas?.addEventListener('touchcancel', onMouseUp)
    }

    const onMouseDown = useCallback((e: MouseEvent | TouchEvent): void => {
        isDrawing.current = true
        handleEventType({ e, toDraw: false, setPosition: true })
    }, [])

    const onMouseMove = (e: MouseEvent | TouchEvent): void => {
        if(isDrawing.current){
            handleEventType({ e, toDraw: true, setPosition: true })
        }
    }

    const onMouseUp = (e: MouseEvent | TouchEvent): void => {
        if(isDrawing.current){
            isDrawing.current = false
            handleEventType({ e, toDraw: true, setPosition: false })
        }
    }

    const handleEventType = ({ e, toDraw, setPosition }: HandleEventTypeProps): void => {
        if(!canvasRef.current){
            return
        }
        const canvasSize = canvasRef.current.width
        
        let coordinates: Coordinates
        if(e instanceof MouseEvent){
            coordinates = {
                x: (e.pageX - canvasRef.current.offsetLeft) / canvasSize,
                y: (e.pageY - canvasRef.current.offsetTop) / canvasSize
            }
        }
        else{
            coordinates = {
                x: (e.changedTouches[0].clientX - canvasRef.current.offsetLeft) / canvasSize,
                y: (e.changedTouches[0].clientY - canvasRef.current.offsetTop) / canvasSize
            }
        }
        if(toDraw){
            const color = getColor()
            
            draw(coordinates, color)
            
            strokesBuffer.current.push({
                newCoordinates: coordinates, 
                currentCoordinates: {
                    x: position.current?.x,
                    y: position.current?.y
                },
                color
            })
        }
        if(setPosition){
            position.current = coordinates
        }
    }

    const draw = ({ x: newX, y: newY }: Coordinates, color: string, currentCoordinates?: Coordinates): void => {
        if(!canvasRef.current) return
        const currentContext = canvasRef.current.getContext('2d')
        if(!currentContext) return

        currentContext.lineWidth = 2
        currentContext.strokeStyle = color
        currentContext.beginPath();
        const canvasSize = canvasRef.current.width
        
        if(currentCoordinates){
            currentContext.moveTo(currentCoordinates.x * canvasSize, currentCoordinates.y * canvasSize);
        }
        else{
            currentContext.moveTo(position.current.x * canvasSize, position.current.y * canvasSize);
        }
        currentContext.lineTo(newX * canvasSize, newY * canvasSize);
        
        currentContext.closePath();
        currentContext.stroke();
    }

    const sendStrokes = () => {
        /* send batch of strokes */
        const strokes = strokesBuffer.current
        if(strokes.length > 0) {
            getSocket().emit("drawing", strokes)
            strokesBuffer.current = []
        }
    }

    const chooseWord = (choice: string) => {
        setOpen(false)
        const socket = getSocket()
        socket.emit("chosen word", choice)
        const turn = getMyTurn()
        if(turn){
            setSelectedWord(choice)
        }
        timerForNextTurn(socket)
        startCountdown()
    }

    const manualSelectionHandler = (index: number) => {
        clearTimeout(autoSelectionTimeout.current)
        chooseWord(wordChoices.current[index])
    }

    const autoSelectionHandler = () => {
        const selectedWord = getSelectedWord()
        if(selectedWord === "") {
            chooseWord(wordChoices.current[0])
        }
    }

    const timerForNextTurn = (socket: SocketIOClient.Socket) => {
        nextTurnTimeout.current = window.setTimeout(() => {
            setMyTurn(false)
            socket.emit("next turn")
        }, roundLength * 1000)
    }

    const canvasBackground = (color: string) => {
        const currentContext = canvasRef.current?.getContext('2d')
        if(!currentContext){
            return
        }
        currentContext.fillStyle = color
        currentContext.fillRect(0, 0, canvasSize, canvasSize);
    }

    const canvasSizeHandler = () => {
        const screenWidth = window.outerWidth
        if(screenWidth < 540){
            setCanvasSize(Math.round(0.97 * screenWidth))
        }
        else{
            setCanvasSize(500)
        }
    }

    const clearCanvas = () => {
        const currentContext = canvasRef.current?.getContext('2d')
        if(!currentContext) return
        currentContext.clearRect(0, 0, canvasSize, canvasSize);
        canvasBackground('white')
    }

    return (
        <>
            <div id="canvasContainer" style={{ height: canvasSize }}>
                <Collapse in={overlay}>
                    <div className="sketchboardLayers" id="overlay" style={{ width: canvasSize, height: canvasSize }}>
                        <div id="overlayContainer">
                            {typeof overlayContent.current === "string" ? 
                                <span className="overlayText">{overlayContent.current}</span>
                            : 
                                <ResultCard memberScores={overlayContent.current} />
                            }
                        </div>
                    </div>
                </Collapse>
                <div>
                    <canvas height={canvasSize} width={canvasSize} ref={canvasRef} style={{ pointerEvents: myTurn ? 'auto' : 'none' }}></canvas>
                </div>
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
                        <ChooseWord wordChoices={wordChoices.current} manualSelectionHandler={manualSelectionHandler} />
                    </div>
                </Fade>
            </Modal>
        </>
    )
}

export default memo(Sketchboard)