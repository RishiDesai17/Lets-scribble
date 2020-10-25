import React, { useRef, useEffect, useCallback } from 'react';
import useStore from '../zustand/store';
import './styles/Playground.css';

type Coordinates = {
    x: number,
    y: number
}

type HandleEventTypeProps = {
    e: MouseEvent | TouchEvent,
    toDraw: boolean,
    setPosition: boolean
}

const Playground: React.FC = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const context = useRef<CanvasRenderingContext2D | null>()
    const isDrawing = useRef<boolean>(false)
    const position = useRef<Coordinates>({ x: 0, y: 0 })
    const previousStrokeSent = useRef<number>(new Date().getTime())

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
        getSocket().on("receiveStrokes", ({ newCoordinates, currentCoordinates }: { newCoordinates: Coordinates, currentCoordinates: Coordinates }) => {
            draw(newCoordinates, currentCoordinates)
        })
        const canvas: HTMLCanvasElement = canvasRef.current;
        context.current = canvas.getContext('2d')
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
            draw({
                x: coordinates.x,
                y: coordinates.y
            })
            const now = new Date().getTime()
            if(now - previousStrokeSent.current > 12){
                getSocket().emit("drawing", { newCoordinates: coordinates, currentCoordinates: {
                    x: position.current?.x,
                    y: position.current?.y
                }})
            }
            previousStrokeSent.current = now
        }
        if(setPosition){
            position.current = coordinates
        }
    }

    const draw = ({ x: newX, y: newY }: Coordinates, currentCoordinates?: Coordinates): void => {
        const currentContext = context.current
        if(!currentContext){
            return
        }
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

    return (
        <>
            <h1>Playground</h1>
            <canvas height={500} width={500} ref={canvasRef}></canvas>
        </>
    )
}

export default Playground