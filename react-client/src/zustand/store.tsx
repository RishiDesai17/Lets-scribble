import create from 'zustand';
import io from 'socket.io-client';

type State = {
    socket: SocketIOClient.Socket
    room: string,
    members: string[]

    setSocket: (socket: SocketIOClient.Socket) => void
    setRoom: (room: string) => void
    setMembers: (members: string[]) => void

    getSocket: () => SocketIOClient.Socket
    getRoom: () => string
}

const INIT_STATE = {
    socket: io.Socket,
    room: "",
    members: []
}

const useStore = create<State>((set, get) => ({
    ...INIT_STATE,

    setSocket: (socket: SocketIOClient.Socket) => set({ socket }),
    setRoom: (room: string) => set({ room }),
    setMembers: (members: string[]) => set({ members }),
    
    getSocket: () => get().socket,
    getRoom: () => get().room
}))

export default useStore