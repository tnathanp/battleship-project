let app = require('express')();
let http = require('http').createServer(app);
let server = require('socket.io')(http);
let uuid = require('uuid');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://battleshipproject:WXfFWQBKEIj1xIeM@cluster.83va3.mongodb.net/battleship-project?retryWrites=true&w=majority";

app.get('/', (req, res) => {
    res.send(req.headers['x-forwarded-for']);
})

app.get('/test', (req, res) => {
    console.log(req.headers['x-forwarded-for']);
    res.send('OK');
})

http.listen(process.env.PORT || 7000, '0.0.0.0', () => {
    console.log('Listening');
});

server.on('connection', socket => {
    
    console.log(socket.request.headers['x-forwarded-for']);
    
    socket.on('login', form => {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            const collection = client.db("battleship-project").collection("user");

            collection.findOne({
                name: 'admin'
            }).then(result => {
                if (result != null) {
                    if (result.name === form.name && result.pass === form.pass) {
                        socket.emit('success login', result.auth);
                        client.close();
                    } else {
                        socket.emit('fail login');
                        client.close();
                    }
                } else {
                    let authKey = uuid.v4();
                    collection.insertOne({
                        name: form.name,
                        pass: form.pass,
                        auth: authKey,
                        profile: form.profile,
                        items: {
                            missile: 0,
                            glasses: 0
                        },
                        points: 0
                    }).then(() => {
                        socket.emit('success login', authKey);
                        client.close();
                    })
                }
            })
        });
    });

    socket.on('online', auth => {
        //known bug: if client edit/clear their auth key, data will not show
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            const collection = client.db("battleship-project").collection("user");

            collection.findOne({
                auth: auth
            }).then(result => {
                let data = {
                    name: result.name,
                    profile: result.profile,
                    items: {
                        missile: result.items.missile,
                        glasses: result.items.glasses
                    },
                    points: result.points
                }
                socket.emit('connection ack', data);
                client.close();
            })
        });
    });

    socket.on('disconnect', name => {
        //remove name from list
    })

});
