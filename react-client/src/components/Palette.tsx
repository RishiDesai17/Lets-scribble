import React, { useState, useEffect } from 'react';
import data from "../data/data.json";
import './styles/Palette.css';

type Props = {
    setColorInParent: (selectedColor: string) => void
}

const Palette: React.FC<Props> = ({ setColorInParent }) => {
    const [selectedColor, setSelectedColor] = useState<string>(data.colors[0])

    useEffect(() => {
        setColorInParent(selectedColor)
    }, [])

    const handleColorChange = (color: string) => {
        setSelectedColor(color)
        setColorInParent(color)
    }

    return (
        <div id="paletteContainer">
                {data.colors.map((color: string) => (
                    <div style={{ border: color === selectedColor ? '1px solid black' : '' }} onClick={() => handleColorChange(color)}>
                        <div className="color" style={{ backgroundColor: color }}></div>
                    </div>
                ))}
        </div>
    )
}

export default Palette