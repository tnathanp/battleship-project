import server from 'socket.io-client';
let socket = server('localhost:7000?auth=' + localStorage.getItem('auth'));
export default socket;
