import create from 'zustand';

type State = {
    myTurn: boolean
    selectedWord: string
    roundLength: number
    timeRemaining: number

    setMyTurn: (myTurn: boolean) => void
    setSelectedWord: (selectedWord: string) => void
    setRoundLength: (roundLength: number) => void
    startCountdown: () => void
    getMyTurn: () => boolean
    resetGameStore: () => void
}

const INIT_STATE = {
    myTurn: false,
    selectedWord: "",
    roundLength: 30,
    timeRemaining: 30
}

const useStore = create<State>((set, get) => ({
    ...INIT_STATE,
    setMyTurn: (myTurn: boolean) => set({ myTurn }),
    setSelectedWord: (selectedWord: string) => set({ selectedWord }),
    setRoundLength: (roundLength: number) => set({ roundLength, timeRemaining: roundLength }),
    startCountdown: () => {
        set({ timeRemaining: get().roundLength })
        const countdown = setInterval(() => {
            const timeRemaining = get().timeRemaining
            if(timeRemaining === 0) {
                clearInterval(countdown)
            }
            else {
                set({ timeRemaining: timeRemaining - 1 })
            }
        }, 1000)
    },
    getMyTurn: () => get().myTurn,
    resetGameStore: () => set({ ...INIT_STATE })
}))

export default useStore