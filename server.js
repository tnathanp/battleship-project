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
        server.emit('update admin console');
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
        server.emit('update admin console');
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
        server.emit('update admin console');
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
        server.emit('update room list', roomList);
        server.emit('update admin console');
    })

    socket.on('disconnecting', () => {
        let roomConnection = server.sockets.adapter.rooms
        for (let key in roomConnection) {
            if (roomConnection[key].length === 2) {
                if (socket.id === Object.keys(roomConnection[key]['sockets'])[0] ||
                    socket.id === Object.keys(roomConnection[key]['sockets'])[1]) {
                    roomList = roomList.filter(each => {
                        if (each.roomID === key) {
                            return false;
                        }
                        return true;
                    })
                    socket.broadcast.to(key).emit('opponent disconnect');
                }
            } else {
                if (socket.id === Object.keys(roomConnection[key]['sockets'])[0]) {
                    roomList = roomList.filter(each => {
                        if (each.roomID === key) {
                            return false;
                        }
                        return true;
                    })
                }
            }
        }
        socket.leaveAll();
    })

    socket.on('leave room', () => {
        socket.leaveAll();
        server.emit('update admin console');
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
            if (server.sockets.adapter.rooms[room].length === 1) {
                socket.join(room);
                socket.to(room).broadcast.emit('join invitation success')
            } else {
                socket.to(room).broadcast.emit('join invitation fail')
            }
        }
        server.emit('update admin console');
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
        server.emit('update admin console');
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
        server.emit('update admin console');
    })

    socket.on('get pocket', () => {

        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");
            let sockets = server.sockets.sockets;

            conn.findOne({ auth: sockets[socket.id]['handshake']['query']['auth'] }, function (err, result) {
                if (err) throw err;
                socket.emit('response pocket', { pocket: result.pocket, missile: result.items.missile, glasses: result.items.glasses });
                /*console.log('pocket & items sent')
                console.log('result' + result)
                console.log('pocket: ' + result.pocket)
                console.log('missile: ' + result.items.missile)
                console.log('glasses: ' + result.items.glasses)*/
                db.close();
            })

        })

    })

    socket.on('buy glasses', data => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            let pocketUpdate = 0
            let glassesUpdate = 0
            conn.findOne({ auth: data.auth }, function (err, result) {
                if (err) throw err;
                //console.log('pocket: ' + result.pocket)
                //console.log('glasses: ' + result.items.glasses)

                pocketUpdate = Number(result.pocket) - 50 * Number(data.num)
                glassesUpdate = Number(result.items.glasses) + Number(data.num)

                //console.log('pocket: ' + pocketUpdate)
                //console.log('glasses: ' + glassesUpdate)

                conn.updateOne({ auth: data.auth }, {
                    $set: {
                        pocket: pocketUpdate,
                        items: {
                            missile: result.items.missile,
                            glasses: glassesUpdate
                        }
                    }
                }, function (err, result) {
                    socket.emit('response buy glasses', { pocket: pocketUpdate, glasses: glassesUpdate });
                    // console.log('done buying ja')


                })
                //console.log('pocket: ' +  result.pocket)
                db.close();
            })
        })
    })

    socket.on('buy missile', data => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            let pocketUpdate = 0
            let missileUpdate = 0
            conn.findOne({ auth: data.auth }, function (err, result) {
                if (err) throw err;
                console.log('pocket: ' + result.pocket)
                console.log('missile: ' + result.items.missile)

                pocketUpdate = Number(result.pocket) - 100 * Number(data.num)
                missileUpdate = Number(result.items.missile) + Number(data.num)

                //  console.log('pocket: ' + pocketUpdate)
                //  console.log('missile: ' + missileUpdate)

                conn.updateOne({ auth: data.auth }, {
                    $set: {
                        pocket: pocketUpdate,
                        items: {
                            missile: missileUpdate,
                            glasses: result.items.glasses
                        }
                    }
                }, function (err, result) {
                    socket.emit('response buy missile', { pocket: pocketUpdate, missile: missileUpdate });
                    // console.log('done buying ja')
                })
                // console.log('pocket: ' +  result.pocket)
                db.close();
            })
        })
    })

    socket.on('admin authorization', auth => {
        if (auth === '72b66123-98b4-4d92-9719-2aca10a98713') {
            let sockets = server.sockets.sockets;
            let online = [];
            let onlineWithData = {};

            //get auth online list for database
            //get auth online list with corespond socket id for room identification
            for (let id in sockets) {
                if (sockets[id]['handshake']['query']['auth'] != null && sockets[id]['handshake']['query']['auth'] != 'null') {
                    online.push({
                        auth: sockets[id]['handshake']['query']['auth']
                    });
                    onlineWithData[sockets[id]['handshake']['query']['auth']] = {
                        socketID: id,
                        joinedRoom: ''
                    }
                }
            }

            //identify the corespond room name of each online member
            let roomConnection = server.sockets.adapter.rooms
            for (let each in onlineWithData) {
                for (let key in roomConnection) {
                    if (roomConnection[key].length === 1) {
                        if (Object.keys(roomConnection[key]['sockets'])[0] === key)
                            continue;
                        else if (Object.keys(roomConnection[key]['sockets'])[0] === onlineWithData[each]['socketID']) {
                            onlineWithData[each]['joinedRoom'] = key;
                            continue;
                        }
                    } else if (roomConnection[key].length === 2) {
                        if (onlineWithData[each]['socketID'] === Object.keys(roomConnection[key]['sockets'])[0]) {
                            onlineWithData[each]['joinedRoom'] = key;
                            continue;
                        } else if (onlineWithData[each]['socketID'] === Object.keys(roomConnection[key]['sockets'])[1]) {
                            onlineWithData[each]['joinedRoom'] = key;
                            continue;
                        }
                    }
                }
            }

            //retrieve info of each auth from database and add room info to the result then send to client
            MongoClient.connect(uri, function (err, db) {
                if (err) throw err;
                let conn = db.db("battleship-project").collection("user");

                conn.find({ $or: online }).toArray(function (err, result) {
                    for (let each of result) {
                        if (each.auth in onlineWithData) {
                            each.room = onlineWithData[each.auth]['joinedRoom'];
                        }
                    }
                    socket.emit('admin authorized', result);
                    db.close();
                })
            })
        } else {
            socket.emit('restricted access');
        }
    })

    //admin tools
    socket.on('add money', auth => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            conn.updateOne({ auth: auth }, { $inc: { pocket: 1000 } }, function (err, result) {
                server.emit('update admin console');
                db.close();
            })

        })
    })

    socket.on('kick', auth => {
        let sockets = server.sockets.sockets;
        for (let id in sockets) {
            if (sockets[id]['handshake']['query']['auth'] != null)
                if (sockets[id]['handshake']['query']['auth'] == auth) {
                    server.to(id).emit('get kicked');
                    break;
                }
        }
    })

    socket.on('reset points', auth => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            conn.updateOne({ auth: auth }, { $set: { points: 0 } }, function (err, result) {
                server.emit('update admin console');
                db.close();
            })

        })
    })

    socket.on('reset room', room => {
        if (room !== '') {
            server.of('/').in(room).clients((error, socketIds) => {
                if (error) throw error;
                socketIds.forEach(socketId => server.sockets.sockets[socketId].leave(room));
            });

            roomList = roomList.filter(each => {
                if (each.roomID === room) {
                    return false;
                }
                return true;
            })
            server.emit('update room list', roomList);
            server.emit('update admin console');
        }
    })

});