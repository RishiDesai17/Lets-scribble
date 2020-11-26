import React, { useRef } from 'react';
import Avatars from './Avatars';
import { TextField, Button } from '@material-ui/core';
import './styles/ModalBody.css';

type Props = {
    modalHandler: (name: string) => void
}

const ModalBody: React.FC<Props> = ({ modalHandler }) => {
    const name = useRef<string>("")
    const avatarRef = useRef<number>(0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if(name.current === ""){
            alert("Please enter a name")
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