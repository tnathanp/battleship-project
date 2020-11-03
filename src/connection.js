import server from 'socket.io-client';
let socket = server('http://battleship-server-a01.herokuapp.com?auth=' + localStorage.getItem('auth'));
export default socket;
