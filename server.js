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
//--------------------------------------------------------------------------------

let roomList = [];
let gameData = [];

server.on('connection', socket => {

    //-Helper function------------------------------------------------------------

    function getOnlineList() {
        console.log('Current online list');
        let sockets = server.sockets.sockets;
        for (let id in sockets) {
            let qAuth = sockets[id]['handshake']['query']['auth'];
            if (qAuth != null && qAuth != 'null') console.log(qAuth + ' on ' + id);
        }
        console.log('\n');
        server.emit('update admin console');
    }

    function getRoom(id) {
        let result = '';
        let rooms = server.sockets.adapter.rooms;
        for (let roomName in rooms) {
            let socketList = Object.keys(rooms[roomName]['sockets']);
            if (socketList[0] === roomName) {
                continue;
            } else if (socketList.includes(id)) {
                result += roomName;
                break;
            }
        }
        return result
    }

    function getId(auth) {
        let result = '';
        let sockets = server.sockets.sockets;
        for (let id in sockets) {
            let qAuth = sockets[id]['handshake']['query']['auth'];
            if (qAuth != null && qAuth != 'null') {
                if (qAuth === auth) {
                    result += id;
                    break;
                }
            }
        }
        return result
    }

    function isInRoom(id, room) {
        return getRoom(id) === room ? true : false
    }

    function isInAnyRoom(id) {
        return getRoom(id) === '' ? false : true
    }

    //--Connection handling-------------------------------------------------------

    getOnlineList();

    socket.on('offline', auth => {
        socket.disconnect();
    })

    socket.on('disconnecting', () => {
        let curRoom = getRoom(socket.id);
        if (curRoom !== '') {
            roomList = roomList.filter(each => {
                if (each.roomID !== curRoom) return true
            })
            gameData = gameData.filter(each => {
                if (each.room !== curRoom) return true
            })
            socket.broadcast.to(curRoom).emit('opponent disconnect');
            socket.leave(curRoom);
        }
    })

    socket.on('disconnect', () => {
        getOnlineList();
        server.emit('update room list', roomList);
    })

    //--User management-----------------------------------------------------------

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
        server.emit('update admin console');
    })

    socket.on('request user data', auth => {
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
    })

    socket.on('request rank data', auth => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            let data = [];
            conn.find({}).sort({ points: -1 }).toArray(function (err, result) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].auth === auth) {
                        data.push({
                            rank: i + 1,
                            name: result[i].user,
                            points: result[i].points,
                            isMe: true
                        })
                    } else {
                        data.push({
                            rank: i + 1,
                            name: result[i].user,
                            points: result[i].points,
                            isMe: false
                        })
                    }
                }
                socket.emit('response rank data', data);
                db.close();
            })
        })
    })

    socket.on('get pocket', () => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");
            let sockets = server.sockets.sockets;

            conn.findOne({ auth: sockets[socket.id]['handshake']['query']['auth'] }, function (err, result) {
                if (err) throw err;
                socket.emit('response pocket', {
                    pocket: result.pocket,
                    missile: result.items.missile,
                    glasses: result.items.glasses
                });
                db.close();
            })
        })
    })

    //--Room management-----------------------------------------------------------

    socket.on('invite friend', req => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            conn.findOne({ user: req.id }, function (err, result) {
                if (err) throw err;

                if (result == null) {
                    socket.emit('friend id not found');
                } else if (result.auth === req.myAuth) {
                    socket.emit('join invitation fail');
                } else {
                    let friendSocketID = getId(result.auth);

                    if (isInAnyRoom(friendSocketID)) {
                        socket.emit('friend already in a room');
                    } else {
                        let roomName = String(socket.id + friendSocketID);
                        socket.join(roomName);
                        server.emit('update admin console');
                        server.to(friendSocketID).emit('receive invitation', roomName);
                    }
                }
                db.close();
            })
        })
    })

    socket.on('join invitation', room => {
        socket.join(room);
        server.to(room).emit('start the game', room);
        gameData.push({ room: room });
        server.emit('update admin console');
    })

    socket.on('reject invitation', room => {
        socket.broadcast.to(room).emit('join invitation fail');
        server.of('/').in(room).clients((error, socketIds) => {
            if (error) throw error;
            socketIds.forEach(socketId => server.sockets.sockets[socketId].leave(room));
        });
        server.emit('update admin console');
    })

    socket.on('leave room', () => {
        socket.leaveAll();
        server.emit('update admin console');
    })

    socket.on('get room list', () => {
        socket.emit('update room list', roomList);
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
        console.log('\n Current room list');
        console.log(roomList);
        server.emit('update admin console');
    })

    socket.on('join room', id => {
        if (server.sockets.adapter.rooms[id] != null) {
            if (server.sockets.adapter.rooms[id].length === 1) {
                socket.join(id);
                for (let i = 0; i <= roomList.length; i++) {
                    if (roomList[i]['roomID'] === id) {
                        roomList.splice(i, 1);
                        server.emit('update room list', roomList);
                        break;
                    }
                }


                server.to(id).emit('start the game', id);
                gameData.push({ room: id });
                console.log('\n Current room list');
                console.log(roomList);
            } else {
                console.log('Player exceed')
            }
        } else {
            console.log('Error room not exists');
        }
        server.emit('update admin console');
    })

    //--Shop----------------------------------------------------------------------
    socket.on('buy glasses', data => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            let pocketUpdate = 0
            let glassesUpdate = 0
            conn.findOne({ auth: data.auth }, function (err, result) {
                if (err) throw err;

                pocketUpdate = Number(result.pocket) - 50 * Number(data.num);
                glassesUpdate = Number(result.items.glasses) + Number(data.num);

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
                })
                db.close();
            })
        })
        server.emit('update admin console');
    })

    socket.on('buy missile', data => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            let pocketUpdate = 0
            let missileUpdate = 0
            conn.findOne({ auth: data.auth }, function (err, result) {
                if (err) throw err;

                pocketUpdate = Number(result.pocket) - 100 * Number(data.num);
                missileUpdate = Number(result.items.missile) + Number(data.num);

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
                })
                db.close();
            })
        })
        server.emit('update admin console');
    })
    //--Game----------------------------------------------------------------------
    socket.on('send ship data', payload => {
        if (payload.isFirstGame) {
            let theName = '';
            MongoClient.connect(uri, function (err, db) {
                if (err) throw err;
                let conn = db.db("battleship-project").collection("user");

                conn.findOne({ auth: payload.auth }, function (err, result) {
                    theName = result.user;
                    for (let each of gameData) {
                        if (each.room === payload.room) {
                            if (Object.keys(each).length === 1) {
                                //first one to send data to this room
                                each[socket.id] = {
                                    data: payload.data,
                                    name: theName,
                                    enemy: new Array(64).fill(0),
                                    missile: 1,
                                    glasses: 2,
                                    score: 0,
                                    nextGameControl: {
                                        wonLastGame: false,
                                        placedShip: false
                                    }
                                }
                            } else {
                                //there's another player waiting
                                each[socket.id] = {
                                    data: payload.data,
                                    name: theName,
                                    enemy: new Array(64).fill(0),
                                    missile: 1,
                                    glasses: 2,
                                    score: 0,
                                    nextGameControl: {
                                        wonLastGame: false,
                                        placedShip: false
                                    }
                                }
                                let opponentID = Object.keys(each).filter(key => {
                                    if (key !== socket.id && key !== 'room') return true
                                })[0];
                                socket.emit('name data', { you: each[socket.id].name, enemy: each[opponentID].name });
                                socket.broadcast.to(payload.room).emit('name data', { enemy: each[socket.id].name, you: each[opponentID].name });

                                let firstStart = Math.round(Math.random());
                                if (firstStart === 0) {
                                    socket.emit('run game', 'wait');
                                    socket.broadcast.to(payload.room).emit('run game', 'go');
                                } else if (firstStart === 1) {
                                    socket.emit('run game', 'go');
                                    socket.broadcast.to(payload.room).emit('run game', 'wait');
                                }
                            }
                            break;
                        }
                    }
                    db.close();
                })
            })
            console.log(gameData);
        } else {
            for (let each of gameData) {
                if (each.room === payload.room) {
                    let opponentID = Object.keys(each).filter(key => {
                        if (key !== socket.id && key !== 'room') return true
                    })[0];

                    if (each[opponentID].nextGameControl.placedShip) {
                        each[socket.id].data = payload.data;
                        each[socket.id].enemy = new Array(64).fill(0);
                        each[socket.id].missile = 1;
                        each[socket.id].glasses = 2;
                        each[socket.id].score = 0;

                        if (each[socket.id].nextGameControl.wonLastGame) {
                            socket.emit('run game', 'go');
                            socket.broadcast.to(payload.room).emit('run game', 'wait');
                        } else {
                            socket.emit('run game', 'wait');
                            socket.broadcast.to(payload.room).emit('run game', 'go');
                        }
                    } else {
                        each[socket.id].data = payload.data;
                        each[socket.id].enemy = new Array(64).fill(0);
                        each[socket.id].missile = 1;
                        each[socket.id].glasses = 2;
                        each[socket.id].score = 0;
                        each[socket.id].nextGameControl.placedShip = true;
                    }
                    break;
                }
            }
        }

    })

    socket.on('timeout', room => {
        socket.broadcast.to(room).emit('opponent timeout');
    })

    socket.on('shot', payload => {
        for (let each of gameData) {
            if (each.room === payload.room) {
                let opponentID = Object.keys(each).filter(key => {
                    if (key !== socket.id && key !== 'room') return true
                })[0];

                let breakTheLoop = false;
                if (payload.missile) {
                    if (each[socket.id].missile === 1) {
                        MongoClient.connect(uri, function (err, db) {
                            if (err) throw err;
                            let conn = db.db("battleship-project").collection("user");

                            conn.findOne({ auth: payload.auth }, function (err, result) {
                                if (result.items.missile >= 1) {
                                    each[socket.id].missile = 0;
                                    socket.emit('used missile');
                                } else {
                                    each[socket.id].missile = 0;
                                    socket.emit('missile not enough');
                                    breakTheLoop = true;
                                }
                                db.close();
                            })
                        })
                    } else {
                        socket.emit('missile not enough');
                        breakTheLoop = true;
                    }
                }

                if (!breakTheLoop) {
                    let myID = socket.id;
                    for (let i = 0; i < payload.target.length; i++) {
                        if (each[opponentID]['data'][payload.target[i]] === 1) {
                            each[myID]['enemy'][payload.target[i]] = 1;
                        } else {
                            each[myID]['enemy'][payload.target[i]] = 3;
                        }
                    }

                    //Calculate score
                    let score = 0;
                    if (each[socket.id].enemy.includes(1)) {
                        for (let i = 0; i < each[socket.id].enemy.length; i++) {
                            if (each[socket.id].enemy[i] === 1) {
                                score += 10;
                                each[socket.id].enemy[i] = 2;
                            }
                        }
                    }
                    each[socket.id].score += score;

                    //Check if the game is done
                    let isGameEnd = 0;
                    each[socket.id].enemy.map(elem => {
                        if (elem === 2) isGameEnd++;
                    });

                    if (isGameEnd === 20) {
                        MongoClient.connect(uri, function (err, db) {
                            if (err) throw err;
                            let conn = db.db("battleship-project").collection("user");

                            conn.findOne({ auth: payload.auth }, function (err, result) {
                                let data = {
                                    winner: {
                                        name: result.user,
                                        auth: result.auth,
                                        score: each[myID].score
                                    },
                                    loser: {
                                        score: each[opponentID].score
                                    }
                                };
                                each[socket.id]['nextGameControl']['wonLastGame'] = true;
                                each[socket.id]['nextGameControl']['placedShip'] = false;
                                each[opponentID]['nextGameControl']['wonLastGame'] = false;
                                each[opponentID]['nextGameControl']['placedShip'] = false;
                                console.log(data);
                                server.to(payload.room).emit('end game', data)
                                db.close();
                            })
                        })
                    } else {
                        socket.emit('update enemy grid', { data: each[socket.id].enemy, score: each[socket.id].score });
                        socket.broadcast.to(payload.room).emit('update my grid', each[socket.id].enemy);
                        let scoreData = {}
                        scoreData[each[socket.id].name] = each[socket.id].score;
                        scoreData[each[opponentID].name] = each[opponentID].score;
                        server.to(payload.room).emit('update score', scoreData);
                    }
                }

                break;
            }
        }
    })

    socket.on('use glasses', payload => {
        for (let each of gameData) {
            if (each.room === payload.room) {
                let opponentID = Object.keys(each).filter(key => {
                    if (key !== socket.id && key !== 'room') return true
                })[0];

                let pos = Math.floor(Math.random() * each[socket.id].enemy.length);
                while (each[socket.id].enemy[pos] !== 0) {
                    pos = Math.floor(Math.random() * each[socket.id].enemy.length);
                }

                if (each[opponentID].data[pos] === 1) {
                    each[socket.id].enemy[pos] = 8; //Found
                    socket.emit('glasses result found', each[socket.id].enemy);
                } else {
                    each[socket.id].enemy[pos] = 9; //Not Found
                    socket.emit('glasses result not found', each[socket.id].enemy);
                }

                MongoClient.connect(uri, function (err, db) {
                    if (err) throw err;
                    let conn = db.db("battleship-project").collection("user");

                    conn.updateOne({ auth: payload.auth }, { $inc: { 'items.glasses': -1 } }, function (err, result) {
                        db.close();
                    })
                })
                break;
            }
        }
    })

    socket.on('pause request', payload => {
        socket.broadcast.to(payload.room).emit('opponent want to pause', payload.name);
    })

    socket.on('pause accept', room => {
        socket.broadcast.to(room).emit('opponent accept pause');
    })

    socket.on('pause reject', room => {
        socket.broadcast.to(room).emit('opponent reject pause');
    })

    socket.on('resume game', room => {
        socket.broadcast.to(room).emit('opponent resume');
    })

    socket.on('play again request', room => {
        socket.broadcast.to(room).emit('opponent want to play again');
    })

    socket.on('play again accept', room => {
        socket.broadcast.to(room).emit('opponent accept play again');
    })

    socket.on('send chat', payload => {
        let msg = payload.name + ': ' + payload.msg;
        socket.broadcast.to(payload.room).emit('receive chat', msg);
        if (payload.msg === '#กล้ามากเก่งมาก') {
            server.to(payload.room).emit('secret key');
        }
        if (payload.msg === 'motherlode') {
            MongoClient.connect(uri, function (err, db) {
                if (err) throw err;
                let conn = db.db("battleship-project").collection("user");

                conn.updateOne({ user: payload.name }, { $inc: { 'pocket': 50000 } }, function (err, result) {
                    socket.emit('receive chat', 'Credited 50000 coins cheater!')
                    db.close();
                })
            })
        }
    })

    socket.on('update missile', auth => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            conn.updateOne({ auth: auth }, { $inc: { 'items.missile': -1 } }, function (err, result) {
                db.close();
            })
        })
    })

    socket.on('update points', payload => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            conn.updateOne({ auth: payload.auth }, { $inc: { 'points': payload.score } }, function (err, result) {
                db.close();
            })
        })
    })

    socket.on('update pocket', auth => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            let conn = db.db("battleship-project").collection("user");

            conn.updateOne({ auth: auth }, { $inc: { 'pocket': 200 } }, function (err, result) {
                db.close();
            })
        })
    })

    //--Admin tools---------------------------------------------------------------
    socket.on('admin authorization', auth => {
        if (auth === '72b66123-98b4-4d92-9719-2aca10a98713') {
            let sockets = server.sockets.sockets;
            let online = [];
            let onlineWithData = {};

            //get auth online list for database request
            //get auth online list with corespond socket id for room identification
            for (let id in sockets) {
                if (sockets[id]['handshake']['query']['auth'] != null && sockets[id]['handshake']['query']['auth'] != 'null') {
                    online.push({
                        auth: sockets[id]['handshake']['query']['auth']
                    });
                    onlineWithData[sockets[id]['handshake']['query']['auth']] = {
                        socketID: id,
                        joinedRoom: getRoom(id)
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
        server.to(getId(auth)).emit('get kicked');
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
                socketIds.forEach(socketId => {
                    server.to(socketId).emit('reset room by admin');
                    server.sockets.sockets[socketId].leave(room);
                });
            });

            roomList = roomList.filter(each => {
                if (each.roomID !== room) return true
            })

            server.emit('update room list', roomList);
            server.emit('update admin console');
        }
    })

});