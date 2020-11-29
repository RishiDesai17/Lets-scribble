import React, { useState, useEffect } from 'react';
import useStore from '../zustand/store';
import { Grid } from '@material-ui/core';
import { avatars } from "../data/data.json";
import './styles/Avatars.css';

const Avatars: React.FC = () => {
    const { selectedAvatar, setAvatar } = useStore(state => ({
        selectedAvatar: state.avatar,
        setAvatar: state.setAvatar
    }))

    return (
        <>
            <h1 id="avatarsTitle">Choose an Avatar !</h1>
            <Grid container justify="center">
                {avatars.map((avatar, index) => {
                    const isSelected = (selectedAvatar === index)
                    return (
                        <Grid item md={2} sm={4} xs={6} onClick={() => setAvatar(index)}>
                            <div className="avatarsContainer" style={{ border: isSelected ? '2px solid black' : '' }}>
                                <div style={{ paddingBottom: !isSelected ? '1.75em' : 0 }}>
                                    <img src={`/images/${avatar}`} className="avatar" />
                                </div>
                                {isSelected && 
                                    <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="green" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                    </svg>
                                }
                            </div>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}

export default Avatars