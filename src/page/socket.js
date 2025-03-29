import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000"; // Update with your backend URL

const socket = io(SOCKET_SERVER_URL, {
    transports: ["websocket"], 
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

export default socket;
