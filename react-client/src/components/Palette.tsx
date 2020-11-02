import React, { useState, useEffect } from 'react';
import { colors } from "../data/data.json";
import './styles/Palette.css';

type Props = {
    setColorInParent: (selectedColor: string) => void
}

const Palette: React.FC<Props> = ({ setColorInParent }) => {
    const [selectedColor, setSelectedColor] = useState<string>(colors[0])
    const [breakpoint, setBreakpoint] = useState<number>(15)

    useEffect(() => {
        setColorInParent(selectedColor)
        breakpointHandler()
        window.addEventListener("resize", breakpointHandler)
    }, [])

    const breakpointHandler = () => {
        setBreakpoint(breakpoint => {
            if(window.outerWidth > 650 && breakpoint === 5){
                console.log(1)
                return 15
            }
            else if(window.outerWidth <= 650 && breakpoint === 15){
                console.log(2)
                return 5
            }
            return breakpoint
        })
    }

    const handleColorChange = (color: string) => {
        setSelectedColor(color)
        setColorInParent(color)
    }

    return (
        <div id="paletteContainer">
            {colors.map((color: string, index: number) => (
                <>
                    <div className="colorContainer" style={{ border: color === selectedColor ? '1px solid black' : '' }} onClick={() => handleColorChange(color)}>
                        <div className="color" style={{ backgroundColor: color }}></div>
                    </div>
                    {index > 0 && index % (breakpoint-1) === 0 && <br />}
                </>
            ))}
            {/* <button onClick={() => console.log(breakpoint)}></button> */}
        </div>
    )
}

export default Palette