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

//---------------------------------------------------------------------

app.get('/requestPic', (req, res) => {
    let auth = req.query.auth;
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        let conn = db.db("battleship-project").collection("user");

        conn.findOne({ auth: auth }, function (err, result) {
            if (err) throw err;
            res.send(result.profile);
            db.close();
        })
    })
})

let online = {};

server.on('connection', socket => {

    //Handling multiple connection
    let auth = socket.handshake.query.auth;
    if(auth != null && auth != 'null'){
		if(auth in online) {
			if(online[auth] === socket.id) {
                //Same connection
                console.log(online);
			} else {
                //Multiple connection detected
                server.to(online[auth]).emit('forced logout');
                socket.emit('forced logout');
				console.log(online);
				socket.disconnect();
			}
		} else {
            //New connection
			online[auth] = socket.id;
			console.log(online);
		}
	}

    //User validation and update online list
    socket.on('login', form => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            conn.findOne({ user: form.user }, function (err, result) {
                if (err) throw err;
                if (result != null) {
                    if (result.user === form.user && result.pass === form.pass) {
                        let currentAuthKey = result.auth;
                        conn.updateOne({ user: form.user }, { $set: { profile: form.profile } }, function (err, result) {
                            online[currentAuthKey] = socket.id;
                            console.log(online);
                            socket.emit('success login', currentAuthKey);
                        })
                    }
                    else {
                        socket.emit('fail login');
                    }
                } else {
                    let newAuthKey = uuid.v4();

                    let payload = {
                        user: form.user,
                        pass: form.pass,
                        auth: newAuthKey,
                        profile: form.profile,
                        items: {
                            missile: 0,
                            glasses: 0
                        },
                        points: 0
                    }

                    conn.insertOne(payload, function (err, result) {
                        if (err) throw err;
                        online[newAuthKey] = socket.id;
                        console.log(online);
                        socket.emit('success login', newAuthKey);
                    })
                }
                db.close();
            })
        })

    });

    //Connection close and update online list
    socket.on('offline', auth => {
        if (auth != null) {
            delete online[auth];
            console.log(online);
            socket.disconnect();
        }
    })

    socket.on('req profile pic', auth => {
        if (auth != null) {
            MongoClient.connect(uri, function (err, db) {
                if (err) throw err;
                let conn = db.db("battleship-project").collection("user");

                conn.findOne({ auth: auth }, function (err, result) {
                    if (err) throw err;
                    socket.emit('res profile pic', result.profile);
                    db.close();
                })
            })
        }
    })
});
