import React, { useState, useEffect, useCallback } from 'react';
import useStore from '../zustand/store';
import useGameStore from '../zustand/game';

const Word: React.FC = () => {
    const getSocket = useStore(state => state.getSocket)

    const { myTurn, selectedWord, setSelectedWord } = useGameStore(useCallback(state => ({
        myTurn: state.myTurn,
        selectedWord: state.selectedWord,
        setSelectedWord: state.setSelectedWord
    }), []))

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        const socket = getSocket()
        
        // listeners for displaying appropriate blanks according to word length for users guessing
        socket.on("start guessing", (wordLength: number) => {
            generateUnderscores(wordLength)
        })

        socket.on("auto-selected", (wordLength: number) => {
            if(!myTurn){
                generateUnderscores(wordLength)
            }
        })
    }

    const generateUnderscores = (wordLength: number) => {
        let word = ""
        for(let i = 0; i < wordLength; i++) {
            word += "_ "
        }
        setSelectedWord(word)
    }

    return (
        <div>
            <p style={{ fontSize: 30, margin: 0 }}>{selectedWord}</p>
        </div>
    )
}

export default Word