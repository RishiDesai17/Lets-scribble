import React, { useState, useCallback } from 'react';
import useStore from '../zustand/store';
import Avatars from './Avatars';
import { TextField, Button } from '@material-ui/core';
import { toastError } from './Toast';
import './styles/ModalBody.css';

type Props = {
    modalHandler: () => void
}

const ModalBody: React.FC<Props> = ({ modalHandler }) => {
    const { getName, setName } = useStore(useCallback(state => ({ getName: state.getName, setName: state.setName }), []))

    const [disabled, setDisabled] = useState<boolean>(false)

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        setDisabled(true)
        const name = getName()
        if(name === ""){
            toastError('Please enter a name')
            setDisabled(false)
            return
        }
        if(name.length < 3 || name.length > 15){
            toastError('Name should be 3-15 characters long')
            setDisabled(false)
            return
        }
        modalHandler()
    }

    return (
        <>
            <form noValidate autoComplete="off" id="modalContainer" onSubmit={e => submit(e)}>
                <TextField id="standard-basic" label="Enter name" autoFocus defaultValue={getName()} onChange={e => setName(e.target.value.trim())} />
                <div id="avatars">
                    <Avatars />
                </div>
                <Button type="submit" id="submit" disabled={disabled}>Submit</Button>
            </form>
        </>
    )
}

export default ModalBody