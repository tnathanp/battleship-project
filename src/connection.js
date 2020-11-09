import server from 'socket.io-client';
let socket = server('35.240.195.51:8080?auth=' + localStorage.getItem('auth'));
export default socket;
