import create from 'zustand';

type State = {
    chats: Message[]
    addChat: (newChat: Message) => void
    clearChats: () => void
}

type Message = {
    socketID: string
    sender: string
    message: string
    color: string
}

const INIT_STATE = {
    chats: []
}

const useStore = create<State>((set, get) => ({
    ...INIT_STATE,
    addChat: (newChat: Message) => set(state => ({ chats: [...state.chats, newChat] })),
    clearChats: () => set({ ...INIT_STATE })
}))

export default useStore