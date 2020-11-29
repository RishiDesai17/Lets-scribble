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
        const name = getName()
        if(name === ""){
            toastError('Please enter a name')
            return
        }
        if(name.length < 3 || name.length > 15){
            toastError('Name should be 3-15 characters long')
            return
        }
        modalHandler()
    }

    const toastError = (message: string) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 2000,
            closeOnClick: true,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true
        });
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