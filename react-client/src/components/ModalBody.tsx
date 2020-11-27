import React, { useRef } from 'react';
import Avatars from './Avatars';
import { TextField, Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import './styles/ModalBody.css';

type Props = {
    modalHandler: (name: string) => void
    avatarRef: React.MutableRefObject<number>
}

const ModalBody: React.FC<Props> = ({ modalHandler, avatarRef }) => {
    const name = useRef<string>("")

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if(name.current === ""){
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
        modalHandler(name.current)
    }

    return (
        <>
            <form noValidate autoComplete="off" id="modalContainer" onSubmit={e => submit(e)}>
                <TextField id="standard-basic" label="Enter name" onChange={e => {
                    name.current = e.target.value
                }} />
                <div id="avatars">
                    <Avatars avatarRef={avatarRef} />
                </div>
                <Button type="submit" id="submit">Submit</Button>
            </form>
        </>
    )
}

export default ModalBody