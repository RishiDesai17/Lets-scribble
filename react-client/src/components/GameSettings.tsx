import React, { useState, useCallback } from 'react';
import {
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Button,
    Card,
    CardContent
} from "@material-ui/core";
import useGameStore from '../zustand/game';
import './styles/GameSettings.css';

type Settings = {
    round_length: number, 
    numRounds: number
}

type Props = {
    numMembers: number
    startGame: (gameSettings: Settings) => void
}

const GameSettings: React.FC<Props> = ({ numMembers, startGame }) => {
    const { roundLength, setRoundLength } = useGameStore(useCallback(state => ({
        roundLength: state.roundLength,
        setRoundLength: state.setRoundLength
    }), []))
    const [numRounds, setNumRounds] = useState<number>(1)

    return (
        <div id="settingsFormContainer">
            <Card>
                <h2 id="settingsTitle">Settings</h2>
                <CardContent>
                    <div className="fieldsContainer">
                        <FormControl variant="outlined" className="inputs">
                            <InputLabel id="demo-simple-select-outlined-label">Round length</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={roundLength}
                                onChange={e => setRoundLength(e.target.value as number)}
                                label="Round length"
                            >
                                {[30, 60, 90, 120, 150].map(time => (
                                    <MenuItem value={time}>{time} seconds</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="fieldsContainer">
                        <FormControl variant="outlined" className="inputs">
                            <InputLabel id="demo-simple-select-outlined-label">Number of rounds</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={numRounds}
                                onChange={e => setNumRounds(e.target.value as number)}
                                label="Number of rounds"
                            >
                                {[1, 2, 3, 4, 5].map(rounds => (
                                    <MenuItem value={rounds}>{rounds}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="fieldsContainer">
                        <Button variant="contained" color="primary" onClick={() => startGame({ 
                            numRounds, 
                            round_length: roundLength
                        })} disabled={numMembers < 2}>Start game</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default React.memo(GameSettings)