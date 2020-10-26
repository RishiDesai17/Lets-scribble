import create from 'zustand';
import io from 'socket.io-client';

type State = {
    socket: SocketIOClient.Socket
    room: string

    setSocket: (socket: SocketIOClient.Socket) => void
    setRoom: (room: string) => void

    getSocket: () => SocketIOClient.Socket
    getRoom: () => string
}

const INIT_STATE = {
    socket: io.Socket,
    room: ""
}

const useStore = create<State>((set, get) => ({
    ...INIT_STATE,

    setSocket: (socket: SocketIOClient.Socket) => set({ socket }),
    setRoom: (room: string) => set({ room }),
    
    getSocket: () => get().socket,
    getRoom: () => get().room
}))

export default useStore