import server from 'socket.io-client';
let socket = server('https://battleship-game.azurewebsites.net?auth=' + localStorage.getItem('auth'));
export default socket;
