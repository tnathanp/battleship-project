let app = require('express')();
let http = require('http').createServer(app);
let server = require('socket.io')(http);

app.get('/', (req, res) => {
    res.send(req.headers['x-forwarded-for']); 
})

app.get('/test', (req, res) => {
	console.log(req.headers['x-forwarded-for']);
	res.send('OK');
})

http.listen(process.env.PORT, '0.0.0.0', () => {
    console.log('listening');
});