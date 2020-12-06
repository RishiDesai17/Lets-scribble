import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Toast: React.FC = (props) => {
    return (
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
    )
}

export const toastInfo = (message: string) => {
    toast.info(message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });
}

export const toastError = (message: string) => {
    toast.error(message, {
        position: "top-center",
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true
    });
}

export default Toast