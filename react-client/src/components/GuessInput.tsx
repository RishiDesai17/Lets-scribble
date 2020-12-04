import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@material-ui/core';
import './styles/GuessInput.css';

type Props = {
    submitGuess: (e: React.FormEvent, guess: string) => void
}

const GuessInput: React.FC<Props> = ({ submitGuess }) => {
    const [guess, setGuess] = useState<string>("")

    const submit = (e: React.FormEvent) => {
        submitGuess(e, guess)
        setGuess("")
    }

    return (
        <form autoComplete="off" noValidate id="guessInputForm" onSubmit={submit}>
            <TextField id="standard-basic" label="Enter guess" value={guess} onChange={e => setGuess(e.target.value)} />
            <Button type="submit" variant="contained" color="primary" id="submitGuess" disabled={guess === ""}>Submit</Button>
        </form>
    )
}

export default GuessInput