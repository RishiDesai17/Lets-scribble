import React, { useState } from 'react';
import { Button } from "@material-ui/core";
import './styles/ChooseWord.css';

type Props = {
    wordChoices: string[]
    manualSelectEnabled: boolean
    manualSelectionHandler: (index: number) => void
}

const ChooseWord: React.FC<Props> = ({ wordChoices, manualSelectEnabled, manualSelectionHandler }) => {
    const [disabled, setDisabled] = useState<boolean>(false)

    const selectWord = (index: number) => {
        setDisabled(true)
        manualSelectionHandler(index)
        setDisabled(false)
    }

    return (
        <>
            <h2 id="chooseWordTitle">Choose a word!</h2>
            {wordChoices.map((word, index) => (
                <Button 
                    variant="contained"
                    color="primary"
                    style={{ margin: '0 3px' }}
                    disabled={disabled || !manualSelectEnabled}
                    onClick={() => selectWord(index)}
                >
                    {word}
                </Button>
            ))}
        </>
    )
}

export default ChooseWord