import server from 'socket.io-client';
let socket = server('https://battleship-server.azurewebsites.net');
export default socket;
