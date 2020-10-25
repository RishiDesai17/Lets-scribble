import create from 'zustand';
import io from 'socket.io-client';

type State = {
    socket: SocketIOClient.Socket,
    setSocket: (socket: SocketIOClient.Socket) => void,
    getSocket: () => SocketIOClient.Socket
}

const INIT_STATE = {
    socket: io.Socket
}

const useStore = create<State>((set, get) => ({
    ...INIT_STATE,
    setSocket: (socket: SocketIOClient.Socket) => set({ socket }),
    getSocket: () => get().socket
}))

export default useStore