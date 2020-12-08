import React, { useCallback } from 'react';
import useStore from '../zustand/store';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import './styles/ResultCard.css';

type Member = {
    socketID: string
    memberDetails: {
        name: string
        avatar: number
    }
    score: number
}

type Props = {
    memberScores: Member[]
}

const ResultCard: React.FC<Props> = ({ memberScores }) => {
    const getSocket = useStore(useCallback(state => state.getSocket, []))
    const history = useHistory()

    return (
        <>
            <h2 id="gameOverTitle">Game Over!</h2>
            <div id="resultsContainer">
                <table>
                    {memberScores.map((member, index) => (
                        <tr>
                            <td><b className="resultContent">#{index + 1}</b></td>
                            <td><span className="resultContent">{member.socketID === getSocket().id ? "You" : member.memberDetails.name}</span></td>
                            <td><span className="resultContent">{member.score}</span></td>
                        </tr>
                    ))}
                </table>
            </div>
            <Button variant="contained" color="primary" onClick={() => history.replace("/")}>Home</Button>
        </>
    )
}

export default ResultCard