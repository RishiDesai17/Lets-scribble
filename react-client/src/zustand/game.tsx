import create from 'zustand';

type State = {
    myTurn: boolean
    selectedWord: string
    setMyTurn: (myTurn: boolean) => void
    setSelectedWord: (selectedWord: string) => void
    getMyTurn: () => boolean
}

const INIT_STATE = {
    myTurn: false,
    selectedWord: ""
}

const useStore = create<State>((set, get) => ({
    ...INIT_STATE,
    setMyTurn: (myTurn: boolean) => set({ myTurn }),
    setSelectedWord: (selectedWord: string) => set({ selectedWord }),
    getMyTurn: () => get().myTurn,
    reset: () => set({ ...INIT_STATE })
}))

export default useStore