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

let roomList = [];

server.on('connection', socket => {

    //Showing connection
    let auth = socket.handshake.query.auth;
    if (auth != null && auth != 'null') {
        let sockets = server.sockets.sockets;
        console.log('Current online list');
        for (let id in sockets) {
            if (sockets[id]['handshake']['query']['auth'] != null)
                console.log(sockets[id]['handshake']['query']['auth'] + ' on ' + id);
        }
        console.log('\n');
    }

    //User validation
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
                        points: 0,
                        pocket: 0
                    }

                    conn.insertOne(payload, function (err, result) {
                        if (err) throw err;
                        socket.emit('success login', newAuthKey);
                    })
                }
                db.close();
            })
        })

    });

    socket.on('change profile', data => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            conn.updateOne({ auth: data.auth }, { $set: { profile: data.url } }, function (err, result) {
                socket.emit('success change profile');
                db.close()
            })
        })
    })

    //Connection close
    socket.on('offline', auth => {
        socket.disconnect();
    })
    socket.on('disconnect', () => {
        let sockets = server.sockets.sockets;
        console.log('Current online list');
        for (let id in sockets) {
            if (sockets[id]['handshake']['query']['auth'] != null && sockets[id]['handshake']['query']['auth'] != 'null')
                console.log(sockets[id]['handshake']['query']['auth'] + ' on ' + id);
        }
        console.log('\n');
        //then the client auto leave room, so we have to remove room from the list

        if (roomList.length !== 0) for (let i = 0; i <= roomList.length; i++) {
            if (roomList[i]['socketID'] === socket.id) {
                roomList.splice(i, 1);
                server.emit('update room list', roomList);
                break;
            }
        }
        server.emit('update room list', roomList);
    })

    socket.on('request user data', auth => {
        if (auth != null) {
            MongoClient.connect(uri, function (err, db) {
                if (err) throw err;
                let conn = db.db("battleship-project").collection("user");

                conn.findOne({ auth: auth }, function (err, result) {
                    if (err) throw err;
                    let data = {
                        user: result.user,
                        profile: result.profile,
                        items: {
                            missile: result.items.missile,
                            glasses: result.items.glasses
                        }
                    }
                    socket.emit('response user data', data);
                    db.close();
                })
            })
        }
    })

    socket.on('join invitation', room => {
        if (server.sockets.adapter.rooms[room] != null) {
           // console.log(server.sockets.adapter.rooms[room].length)
            if (server.sockets.adapter.rooms[room].length === 1) {
                socket.join(room);
               // console.log(server.sockets.adapter.rooms[room].length)
                socket.to(room).broadcast.emit('join invitation success')
            } else {
                socket.to(room).broadcast.emit('join invitation fail')
            }
        }
    })

    socket.on('request friend id', friendID => {
        let findFriendID = ''

        if (friendID != null) {
            MongoClient.connect(uri, function (err, db) {
                if (err) throw err;
                let conn = db.db("battleship-project").collection("user");

                conn.findOne({ user: friendID }, function (err, result) {
                    if (err) throw err;

                    if (result == null) {
                        socket.emit('friend id not found');
                    } else {
                        //console.log('find result' + ' ' + result.auth);
                        let sockets = server.sockets.sockets;
                        for (let id in sockets) {
                            //console.log(id + ' ' + result.auth);
                            if (sockets[id]['handshake']['query']['auth'] != null) {
                                if (sockets[id]['handshake']['query']['auth'] === result.auth) {
                                    findFriendID = id;
                                    break;
                                }
                            }
                        }

                        //console.log('find friend id leaw ja ' + findFriendID);
                        let roomname = String(socket.id + findFriendID)
                        socket.join(roomname)

                        //console.log('room name sent ' + roomname);
                        server.to(findFriendID).emit('receive invitation', roomname)
                    }
                    db.close();
                })
            })
        }
    })

    socket.on('create room', id => {

        if (roomList.length === 0) {
            let data = {
                socketID: socket.id,
                roomID: id
            }
            roomList.push(data);
            socket.join(id);
            socket.emit('success create room', id);
            server.emit('update room list', roomList);

        } else {
            for (let each of roomList) {
                if (each['roomID'] === id) {
                    socket.emit('room id already exist');
                    break;
                } else {
                    let data = {
                        socketID: socket.id,
                        roomID: id
                    }
                    roomList.push(data);
                    socket.join(id);
                    socket.emit('success create room', id);
                    server.emit('update room list', roomList);
                    break;
                }
            }
        }
        console.log('\n current room list');
        console.log(roomList);
    })

    socket.on('get room list', () => {
        socket.emit('update room list', roomList);
    })

    socket.on('join room', id => {
        if (server.sockets.adapter.rooms[id] != null) {
            if (server.sockets.adapter.rooms[id].length === 1) {
                socket.join(id);
                //remove the room from room list as i can support only 2 people
                for (let i = 0; i <= roomList.length; i++) {
                    if (roomList[i]['roomID'] === id) {
                        roomList.splice(i, 1);
                        server.emit('update room list', roomList);
                        break;
                    }
                }

                //test emitting to the room
                server.to(id).emit('start the game');
                console.log('\n current room list');
                console.log(roomList);
            } else {
                console.log('player exceed')
            }
        } else {
            console.log('error room not exists');
        }
    })

    socket.on('admin authorization', auth => {
        if (auth === '710789ee-5918-4e44-a946-33ddacaab753')
            socket.emit('admin authorized');
        else
            socket.emit('restricted access')
    })

    socket.on('admin request online list', data => {
        socket.broadcast.to(data.roomID).emit('msg rcv', data.msg);
    })

});
