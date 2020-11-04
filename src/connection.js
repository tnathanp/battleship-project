import server from 'socket.io-client';
let socket = server('https://battleship-server-a01.herokuapp.com?auth=' + localStorage.getItem('auth'));
export default socket;
