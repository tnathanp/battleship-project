import server from 'socket.io-client';
let socket = server('https://battleship-server.azurewebsites.net?auth=' + localStorage.getItem('auth'));
export default socket;
