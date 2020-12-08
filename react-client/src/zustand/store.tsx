import create from 'zustand';
import io from 'socket.io-client';

type State = {
    isHost: boolean
    avatar: number
    turn: boolean
    members: Member[]

    setSocket: (socket: SocketIOClient.Socket) => void
    setRoom: (room: string) => void
    setName: (name: string) => void
    setMembers: (members: Member[]) => void
    addMember: (newMember: Member) => void
    removeMember: (exMember: string) => void
    setIsHost: (isHost: boolean) => void
    setAvatar: (avatar: number) => void
    setTurn: (turn: boolean) => void
    reset: () => void

    getSocket: () => SocketIOClient.Socket
    getRoom: () => string
    getName: () => string
    getIsHost: () => boolean
    getAvatar: () => number
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
    score: number
}

const INIT_STATE = {
    isHost: false,
    avatar: 0,
    turn: false,
    members: []
}

const GLOBAL_VARS: GLOBAL_VAR = {
    socket: io.Socket,
    room: "",
    name: ""
}

const useStore = create<State>((set, get) => ({
    ...INIT_STATE,

    setSocket: (socket: SocketIOClient.Socket) => GLOBAL_VARS.socket = socket,
    setRoom: (room: string) => GLOBAL_VARS.room = room,
    setName: (name: string) => GLOBAL_VARS.name = name,
    setMembers: (members: Member[]) => set({ members }),
    addMember: (newMember: Member) => set(state => ({ members: [...state.members, newMember] })),
    removeMember: (exMember: string) => set(state => {
        let members = state.members
        console.log(exMember, members)
        members = members.filter(member => member.socketID !== exMember)
        return { members }
    }),
    setIsHost: (isHost: boolean) => set({ isHost }),
    setAvatar: (avatar: number) => set({ avatar }),
    setTurn: (turn: boolean) => set({ turn }),
    reset: () => {
        set({ ...INIT_STATE, avatar: get().avatar })
        GLOBAL_VARS.socket = io.Socket
        GLOBAL_VARS.room = ""
    },
    
    getSocket: () => GLOBAL_VARS.socket,
    getRoom: () => GLOBAL_VARS.room,
    getName: () => GLOBAL_VARS.name,
    getAvatar: () => get().avatar,
    getIsHost: () => get().isHost
}))

export default useStore