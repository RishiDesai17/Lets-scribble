import React, { useState, useEffect, useCallback, useRef } from 'react';
import useStore from '../zustand/store';
import { Tooltip } from '@material-ui/core';
import './styles/ShareLink.css';

const CopyLink: React.FC = () => {
    const [tooltipText, setTooltipText] = useState<string>("Copy")
    const link = useRef<string>("")

    const getRoom = useStore(useCallback(state => state.getRoom, []))

    useEffect(() => {
        let { protocol, hostname, port } = window.location
        if(window.location.port !== ""){
            hostname += ":" + port
        }
        link.current = `${protocol}//${hostname}/lobby/${getRoom()}`
    }, [])

    const copyLinkToClipboard = () => {
        var copyhelper = document.createElement("input");
        copyhelper.select();
        copyhelper.value = link.current;
        document.body.appendChild(copyhelper);
        copyhelper.select();
        document.execCommand("copy");
        document.body.removeChild(copyhelper);
        setTooltipText("Copied to clipboard!")
        setTimeout(() => {
            setTooltipText("Copy")
        }, 3000)
    }

    return (
        <Tooltip title={tooltipText} onClick={copyLinkToClipboard}>
            <div id="shareLinkContainer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16" id="shareLink">
                    <path fill-rule="evenodd" d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
                </svg>
            </div>
        </Tooltip>
    )
}

export default CopyLink