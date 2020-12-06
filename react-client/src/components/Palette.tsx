import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { colors } from "../data/data.json";
import './styles/Palette.css';

type Props = {
    setColorInParent: (selectedColor: string) => void
}

const Palette: React.FC<Props> = ({ setColorInParent }) => {
    const [selectedColor, setSelectedColor] = useState<string>(colors[0])
    const [mobileView, setMobileView] = useState<boolean>(false)

    useEffect(() => {
        setColorInParent(selectedColor)
        palleteHandler()
        window.addEventListener("resize", palleteHandler)
        return(() => {
            window.removeEventListener("resize", palleteHandler)
        })
    }, [])

    const palleteHandler = () => {
        const screenWidth = window.outerWidth
        setMobileView(mobileView => {
            if(mobileView && screenWidth >= 600){
                return false
            }
            else if(!mobileView && screenWidth < 600){
                return true
            }
            return mobileView
        })
    }

    const handleColorChange = (color: string) => {
        setSelectedColor(color)
        setColorInParent(color)
    }

    const displayColors = () => {
        let colorsJSX = []
        for(let i=0; i<5; i++){
            const colorGroup = []
            for(let j = i*5; j < (i+1)*5; j++){
                const isSelected = colors[j] === selectedColor
                colorGroup.push(
                    <div style={{ border: isSelected ? '1.8px solid white' : '' }} 
                        onClick={() => handleColorChange(colors[j])}
                    >
                        <div className="color" style={{ backgroundColor: colors[j] }}></div>
                    </div>
                )
            }
            colorsJSX.push(
                <Grid item id="colorsContainer"
                    style={{ justifyContent: (mobileView ? 'center' : ((i%2 === 0) ? 'flex-end' : 'flex-start')) }}
                    md={6} sm={6} xs={12}
                >
                    {colorGroup}
                </Grid>
            )
        }
        return colorsJSX
    }

    return (
        <div id="paletteContainer">
            <Grid container>
                {displayColors()}
            </Grid>
        </div>
    )
}

export default Palette