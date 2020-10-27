import create from 'zustand';
import io from 'socket.io-client';

type State = {
    socket: SocketIOClient.Socket
    room: string
    isHost: boolean
    members: string[]

    setSocket: (socket: SocketIOClient.Socket) => void
    setRoom: (room: string) => void
    setMembers: (members: string[]) => void
    addMember: (member: string) => void
    setIsHost: (isHost: boolean) => void

    getSocket: () => SocketIOClient.Socket
    getRoom: () => string
    getIsHost: () => boolean
}

const INIT_STATE = {
    socket: io.Socket,
    room: "",
    isHost: false,
    members: []
}

const useStore = create<State>((set, get) => ({
    ...INIT_STATE,

    setSocket: (socket: SocketIOClient.Socket) => set({ socket }),
    setRoom: (room: string) => set({ room }),
    setMembers: (members: string[]) => set({ members }),
    addMember: (member: string) => set(state => ({ members: [...state.members, member] })),
    setIsHost: (isHost: boolean) => set({ isHost }),
    
    getSocket: () => get().socket,
    getRoom: () => get().room,
    getIsHost: () => get().isHost
}))

export default useStore