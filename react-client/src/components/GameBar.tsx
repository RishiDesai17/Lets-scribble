import React from 'react';
import { Card } from '@material-ui/core';
import Word from './Word';
import Score from './Score';
import "./styles/GameBar.css";

const GameBar: React.FC = () => {
    return (
        <Card id="gameBar">
            <div id="objectsContainer">
                <div></div>
                <Word />
                <Score />
            </div>
        </Card>
    )
}

export default GameBar