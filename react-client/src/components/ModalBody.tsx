import React, { useRef, useCallback } from 'react';
import useStore from '../zustand/store';
import Avatars from './Avatars';
import { TextField, Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import './styles/ModalBody.css';

type Props = {
    modalHandler: () => void
}

const ModalBody: React.FC<Props> = ({ modalHandler }) => {
    const { getName, setName } = useStore(useCallback(state => ({ getName: state.getName, setName: state.setName }), []))

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if(getName() === ""){
            toast.error('Please enter a name', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            return
        }
        modalHandler()
    }

    return (
        <>
            <form noValidate autoComplete="off" id="modalContainer" onSubmit={e => submit(e)}>
                <TextField id="standard-basic" label="Enter name" defaultValue={getName()} onChange={e => setName(e.target.value)} />
                <div id="avatars">
                    <Avatars />
                </div>
                <Button type="submit" id="submit">Submit</Button>
            </form>
        </>
    )
}

export default ModalBody