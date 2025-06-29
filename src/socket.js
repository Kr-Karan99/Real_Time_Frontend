import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket'],
    };
    // Use your backend's WebSocket URL here
    return io('https://realtimebackend-production.up.railway.app', options);
};