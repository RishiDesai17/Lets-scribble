import create from 'zustand';
import io from 'socket.io-client';

type State = {
    // socket: SocketIOClient.Socket
    // room: string
    // name: string
    isHost: boolean
    turn: boolean
    members: Member[]

    setSocket: (socket: SocketIOClient.Socket) => void
    setRoom: (room: string) => void
    setName: (name: string) => void
    setMembers: (members: Member[]) => void
    addMember: (newMember: Member) => void
    removeMember: (exMember: string) => void
    setIsHost: (isHost: boolean) => void
    setTurn: (turn: boolean) => void
    reset: () => void

    getSocket: () => SocketIOClient.Socket
    getRoom: () => string
    getName: () => string
    getIsHost: () => boolean
}

type GLOBAL_VAR = {
    socket: SocketIOClient.Socket
    room: string
    name: string
}

type Member = {
    socketID: string
    memberDetails: {
        name: string
        avatar: number
    }
}

const INIT_STATE = {
    socket: io.Socket,
    room: "",
    name: "",
    isHost: false,
    turn: false,
    members: []
}

const GLOBAL_VARS: GLOBAL_VAR = {
    socket: io.Socket,
    room: "",
    name: "",
}

const useStore = create<State>((set, get) => ({
    ...INIT_STATE,

    setSocket: (socket: SocketIOClient.Socket) => GLOBAL_VARS.socket = socket, //set({ socket }),
    setRoom: (room: string) => GLOBAL_VARS.room = room, //set({ room }),
    setName: (name: string) => GLOBAL_VARS.name = name, //set({ name }),
    setMembers: (members: Member[]) => set({ members }),
    addMember: (newMember: Member) => set(state => ({ members: [...state.members, newMember] })),
    removeMember: (exMember: string) => set(state => {
        let members = state.members
        console.log(exMember, members)
        members = members.filter(member => member.socketID !== exMember)
        return { members }
    }),
    setIsHost: (isHost: boolean) => set({ isHost }),
    setTurn: (turn: boolean) => set({ turn }),
    reset: () => {
        set({ ...INIT_STATE })
        GLOBAL_VARS.socket = io.Socket
        GLOBAL_VARS.room = ""
    },
    
    getSocket: () => GLOBAL_VARS.socket, //get().socket,
    getRoom: () => GLOBAL_VARS.room,
    getName: () => GLOBAL_VARS.name,
    getIsHost: () => get().isHost
}))

export default useStore