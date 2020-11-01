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
    addMember: (newMember: string) => void
    removeMember: (exMember: string) => void
    setIsHost: (isHost: boolean) => void
    reset: () => void

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
    addMember: (newMember: string) => set(state => ({ members: [...state.members, newMember] })),
    removeMember: (exMember: string) => set(state => {
        let members = state.members
        members = members.filter(member => member !== exMember)
        return { members }
    }),
    setIsHost: (isHost: boolean) => set({ isHost }),
    reset: () => set({ ...INIT_STATE }),
    
    getSocket: () => get().socket,
    getRoom: () => get().room,
    getIsHost: () => get().isHost
}))

export default useStore