import server from 'socket.io-client';
let socket = server('localhost:7000');
export default socket;