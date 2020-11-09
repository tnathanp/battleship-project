import server from 'socket.io-client';
let socket = server('https://fresh-arcade-295121.et.r.appspot.com?auth=' + localStorage.getItem('auth'));
export default socket;
