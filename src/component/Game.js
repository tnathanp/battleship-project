import React from 'react';
import socket from '../connection';
import { Row, Col, Container, Card, Navbar, Nav, Button, InputGroup, FormControl, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { IoIosRocket } from 'react-icons/io';
import { BiGlasses, BiTargetLock } from 'react-icons/bi';
import { TiWaves } from 'react-icons/ti';

import './Game.css';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //Shared things
            hovered: [],
            secretSong: false,
            isFirstGame: true,
            //Data
            data: new Array(64).fill(0),
            enemyData: new Array(64).fill(0),
            //Gaming things
            chat: [],
            chatMsg: '',
            name: '',
            enemyName: '',
            seconds: 10,
            isUsingMissile: false,
            score: 0,
            enemyScore: 0,
            isMyTurn: false,
            isPause: false,
            missileAvai: 0,
            radarAvai: 0,
            audio: [
                new Audio('/explode.mp3'),
                new Audio('/missile.mp3'),
                new Audio('/radar.mp3'),
                new Audio('/win.mp3'),
                new Audio('/lose.mp3')
            ],
            //Planning things
            isPlanningStage: true,
            currentShipSize: 4,
            shipAmount: 1,
            horizontal: true,
            vertical: false,
            lastPlaced: [],
            controlButton: false
        }
    }

    hoverHandle(pos) {
        let shipSize = this.state.currentShipSize;
        if (this.state.isPlanningStage) {
            if (this.state.horizontal) {
                if (pos % 8 + shipSize < 9) {
                    let indexes = new Array(shipSize).fill(pos);
                    let n = 0;
                    indexes = indexes.map(each => {
                        n++;
                        return each + n - 1;
                    })
                    this.setState({
                        hovered: indexes
                    })
                }
            } else if (this.state.vertical) {
                if (Math.floor(pos / 8) + shipSize < 9) {
                    let indexes = new Array(shipSize).fill(pos);
                    let n = 0;
                    indexes = indexes.map(each => {
                        n++;
                        return each + 8 * (n - 1);
                    })
                    this.setState({
                        hovered: indexes
                    })
                }
            }
        } else {
            let indexes;
            if (this.state.isUsingMissile) {
                if (pos <= 6 && pos >= 0) {
                    indexes = [pos - 1, pos, pos + 1, pos + 8];
                } else if (pos >= 57 && pos <= 63) {
                    indexes = [pos - 8, pos - 1, pos, pos + 1];
                } else if (pos % 8 === 0) {
                    indexes = [pos - 8, pos, pos + 1, pos + 8];
                } else if ((pos + 1) % 8 === 0) {
                    indexes = [pos - 8, pos - 1, pos, pos + 8];
                } else {
                    indexes = [pos - 8, pos - 1, pos, pos + 1, pos + 8];
                }
            } else {
                indexes = [pos];
            }
            this.setState({
                hovered: indexes
            })
        }
    }

    hoveredHandle(pos) {
        this.setState({
            hovered: []
        })
    }

    changeAlign(axis) {
        if (axis === 'hori') {
            this.setState({
                horizontal: true,
                vertical: false
            })
        } else if (axis === 'vert') {
            this.setState({
                horizontal: false,
                vertical: true
            })
        }
    }

    fill(pos, size, axis) {
        let result = false;
        if (axis === 'hori') {
            //Horizontal

            //Check if available
            for (let i = pos; i < pos + size; i++) {
                if (this.state.data[i] === 1) {
                    return result
                }
            }
            //Fill data with ship
            let newData = this.state.data.slice();
            for (let i = pos; i < pos + size; i++) {
                newData[i] = 1;
            }
            this.setState({
                data: newData
            })
            this.state.lastPlaced.push({ pos: pos, size: size, axis: 'hori' });
            this.setState({
                controlButton: this.state.lastPlaced.length !== 0
            })
            return true

        } else if (axis === 'vert') {
            //Vertical

            //Check if available
            for (let i = 0; i < size; i++) {
                if (this.state.data[pos + 8 * i] === 1) {
                    return result
                }
            }
            //Fill data with ship
            let newData = this.state.data.slice();
            for (let i = 0; i < size; i++) {
                newData[pos + 8 * i] = 1;
            }
            this.setState({
                data: newData
            })
            this.state.lastPlaced.push({ pos: pos, size: size, axis: 'vert' });
            this.setState({
                controlButton: this.state.lastPlaced.length !== 0
            })
            return true

        }
    }

    plan(pos) {
        if (this.state.shipAmount !== 0) {
            let shipSize = this.state.currentShipSize;
            if (this.state.horizontal) {
                if (pos % 8 + shipSize < 9) {
                    if (this.fill(pos, shipSize, 'hori')) {
                        console.log('Done');
                        this.setState({
                            shipAmount: this.state.shipAmount - 1
                        })
                    } else {
                        console.log('Unable');
                    }
                }
            } else if (this.state.vertical) {
                if (this.fill(pos, shipSize, 'vert')) {
                    console.log('Done');
                    this.setState({
                        shipAmount: this.state.shipAmount - 1
                    })
                } else {
                    console.log('Unable');
                }
            }
        } else {
            Swal.fire({
                html: 'You have no available ship left for size <b>' + this.state.currentShipSize + '</b>',
                icon: 'warning'
            })
        }
    }

    back() {
        let toRemove = this.state.lastPlaced.pop();
        let pos = toRemove.pos;
        let size = toRemove.size;
        if (toRemove.axis === 'hori') {
            let newData = this.state.data.slice();
            for (let i = pos; i < pos + size; i++) {
                newData[i] = 0;
            }
            this.setState({
                data: newData,
                shipAmount: this.state.shipAmount + 1
            })
        } else if (toRemove.axis === 'vert') {
            let newData = this.state.data.slice();
            for (let i = 0; i < size; i++) {
                newData[pos + 8 * i] = 0;
            }
            this.setState({
                data: newData,
                shipAmount: this.state.shipAmount + 1
            })
        }
        this.setState({
            controlButton: this.state.lastPlaced.length !== 0
        })
    }

    next() {
        let shipSize = this.state.currentShipSize;
        if (this.state.shipAmount === 0 && this.state.currentShipSize !== 1) {
            let newAmount = 0;
            if (shipSize === 4) newAmount = 2;
            else if (shipSize === 3) newAmount = 3;
            else if (shipSize === 2) newAmount = 4;
            this.setState({
                currentShipSize: shipSize - 1,
                shipAmount: newAmount,
                controlButton: false,
                lastPlaced: []
            })
        } else {
            if (this.state.currentShipSize === 1 && this.state.shipAmount === 0) {
                socket.emit('send ship data', { data: this.state.data, auth: localStorage.getItem('auth'), isFirstGame: this.state.isFirstGame, room: this.props.room });
                Swal.fire({
                    title: 'Waiting for the opponent',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    willOpen: () => {
                        Swal.showLoading();
                    }
                })
            } else {
                Swal.fire({
                    html: 'You have <b>' + this.state.shipAmount + '</b> ship left to be placed',
                    icon: 'warning'
                })
            }
        }
    }

    game(pos) {
        let posCond = this.state.enemyData[pos] === 0 || this.state.enemyData[pos] === 8 || this.state.enemyData[pos] === 9;
        if (posCond && this.state.isMyTurn) {
            socket.emit('shot', {
                target: this.state.isUsingMissile ? this.state.hovered : [pos],
                missile: this.state.isUsingMissile,
                room: this.props.room,
                auth: localStorage.getItem('auth')
            });
            if (this.state.isUsingMissile) {
                this.setState({
                    missileAvai: 0,
                    isUsingMissile: false
                })
                this.state.audio[1].currentTime = 0;
                this.state.audio[1].play();
            } else {
                this.state.audio[0].currentTime = 0;
                this.state.audio[0].play();
            }
        }
    }

    pause() {
        Swal.fire({
            title: 'Waiting for opponent decision',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        })
        socket.emit('pause request', { name: this.state.name, room: this.props.room });
    }

    resume() {
        if (this.state.isMyTurn) {
            this.interval = setInterval(() => this.tick(), 1000);
        }
        this.setState({
            isPause: false
        })
        socket.emit('resume game', this.props.room);
    }

    handleChat(e) {
        this.setState({
            chatMsg: e.target.value
        })
    }

    send() {
        if (this.state.chatMsg !== '') {
            socket.emit('send chat', { name: this.state.name, msg: this.state.chatMsg, room: this.props.room });
            let chatInput = document.getElementById('chat-input');
            chatInput.value = '';
            let arr = this.state.chat.slice();
            arr.push(this.state.name + ': ' + this.state.chatMsg);
            this.setState({
                chat: arr
            }, () => {
                let chatbox = document.getElementById("chat-box");
                var xH = chatbox.scrollHeight;
                chatbox.scrollTo(0, xH);
                this.setState({
                    chatMsg: ''
                })
            })
            this.forceUpdate();
        }
    }

    handleKey(e) {
        if (e.key === 'Enter') {
            if (this.state.chatMsg !== '') { this.send(); }
        }
    }

    renderPlanBoard() {
        let board = []
        for (let row = 1; row <= 8; row++) {
            let elem = []
            for (let column = 1; column <= 8; column++) {
                let pos = 8 * (row - 1) + (column - 1);
                elem.push((
                    <button
                        className="psquare"
                        style={
                            this.state.hovered.includes(pos)
                                ?
                                { background: '#ecb865', opacity: '0.5' }
                                :
                                this.state.data[pos] === 1 ? { background: '#fbc9be' } : {}
                        }
                        onClick={() => this.plan(pos)}
                        onMouseEnter={() => this.hoverHandle(pos)}
                        onMouseLeave={() => this.hoveredHandle(pos)}
                    />
                ));
            }
            board.push(elem);
        }
        return board;
    }

    renderEnemyBoard() {
        let board = []
        for (let row = 1; row <= 8; row++) {
            let elem = []
            for (let column = 1; column <= 8; column++) {
                let pos = 8 * (row - 1) + (column - 1);
                elem.push((
                    <button
                        className="square"
                        style={
                            this.state.hovered.includes(pos)
                                ?
                                this.state.isMyTurn ? { background: '#ecb865' } :
                                    this.state.enemyData[pos] === 2 ? { background: '#6A5ACD' } :
                                        this.state.enemyData[pos] === 3 ? { background: '#7B68EE' } : {}
                                :
                                this.state.enemyData[pos] === 2 ? { background: '#6A5ACD' } :
                                    this.state.enemyData[pos] === 3 ? { background: '#7B68EE' } : {}
                        }
                        onClick={() => this.game(pos)}
                        disabled={this.state.isPause}
                        onMouseEnter={() => this.hoverHandle(pos)}
                        onMouseLeave={() => this.hoveredHandle(pos)}
                    >{this.state.enemyData[pos] === 2
                        ?
                        (<>X</>)
                        :
                        this.state.enemyData[pos] === 8 ? (<BiTargetLock />) :
                            this.state.enemyData[pos] === 9 ? (<TiWaves />) : (<></>)
                        }
                    </button>
                ));
            }
            board.push(elem);
        }
        return board;
    }

    renderMyBoard() {
        let board = []
        for (let row = 1; row <= 8; row++) {
            let elem = []
            for (let column = 1; column <= 8; column++) {
                let pos = 8 * (row - 1) + (column - 1);
                elem.push((
                    <button
                        className="square"
                        style={
                            this.state.data[pos] === 1
                                ?
                                { background: '#fbc9be' }
                                :
                                this.state.data[pos] === 2 ? { background: '#6A5ACD' } :
                                    this.state.data[pos] === 3 ? { background: '#7B68EE' } : {}
                        }
                        disabled="true"
                    >{this.state.data[pos] === 2 ? (<>X</>) : (<></>)}</button>
                ));
            }
            board.push(elem);
        }
        return board;
    }

    equipMissile() {
        this.setState({
            isUsingMissile: true
        });
    }

    cancelMissile() {
        this.setState({
            isUsingMissile: false
        })
    }

    useGlasses() {
        socket.emit('use glasses', { room: this.props.room, auth: localStorage.getItem('auth') });
        this.state.audio[2].currentTime = 0;
        this.state.audio[2].play();
        this.setState({
            radarAvai: this.state.radarAvai - 1
        })
    }

    tick() {
        let cur = this.state.seconds;
        this.setState({
            seconds: cur - 1
        })

        if (this.state.seconds === 0) {
            clearInterval(this.interval)
            socket.emit('timeout', this.props.room);
            this.setState({
                isMyTurn: false
            })
        }

        if (this.state.seconds < 0) {
            clearInterval(this.interval)
            this.setState({
                seconds: 0,
                isMyTurn: false
            })
            socket.emit('timeout', this.props.room);
        }
    }

    resetState() {
        this.setState({
            hovered: [],
            secretSong: false,
            data: new Array(64).fill(0),
            enemyData: new Array(64).fill(0),
            chat: [],
            chatMsg: '',
            seconds: 10,
            isUsingMissile: false,
            score: 0,
            enemyScore: 0,
            isMyTurn: false,
            isPause: false,
            missileAvai: 0,
            radarAvai: 0,
            isPlanningStage: true,
            currentShipSize: 4,
            shipAmount: 1,
            horizontal: true,
            vertical: false,
            lastPlaced: [],
            controlButton: false,
            isFirstGame: false
        }, () => {
            socket.emit('request user data', localStorage.getItem('auth'));
        })
    }

    componentDidMount() {
        Swal.fire({
            title: 'Welcome to the game',
            html: '<a>In this stage, place your ship on the grid then press <b>\'Next\'</b> after you have placed all the ship of that <b>particular size</b></a>'
        }).then(result => {
            Swal.fire({
                title: 'Warning',
                html: '<p>Once you press <b>\'Next\'</b>, you can\'t go back to rearrange your ship in previous size</p>',
                icon: 'warning'
            })
        })

        socket.emit('request user data', localStorage.getItem('auth'));

        socket.on('response user data', data => {
            if (data.items.missile >= 1) {
                this.setState({
                    missileAvai: 1
                })
            }
            if (data.items.glasses === 1) {
                this.setState({
                    radarAvai: 1
                })
            } else if (data.items.glasses >= 2) {
                this.setState({
                    radarAvai: 2
                })
            }
        })

        socket.on('name data', data => {
            this.setState({
                name: data.you,
                enemyName: data.enemy
            })
        })

        socket.on('update score', data => {
            this.setState({
                score: data[this.state.name],
                enemyScore: data[this.state.enemyName]
            })
        })

        socket.on('run game', status => {
            this.setState({
                isMyTurn: status === 'go' ? true : false,
                isPlanningStage: false
            })
            let timerInterval;
            Swal.fire({
                title: 'Game will start in',
                html: '<a style="margin-top: -20px; margin-bottom: -20px; font-size: 50px"></a>',
                timer: 3000,
                timerProgressBar: true,
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                    timerInterval = setInterval(() => {
                        const content = Swal.getContent()
                        if (content) {
                            const t = content.querySelector('a')
                            if (t) {
                                t.textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                            }
                        }
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    if (status === 'go') {
                        this.setState({ seconds: 10 });
                        this.interval = setInterval(() => this.tick(), 1000);
                    }
                }
            })
        })

        socket.on('opponent timeout', () => {
            this.setState({
                isMyTurn: true,
                seconds: 10
            })
            this.interval = setInterval(() => this.tick(), 1000);
        })

        socket.on('opponent want to pause', name => {
            Swal.fire({
                text: name + ' wanted to pause the game',
                showDenyButton: true,
                allowOutsideClick: false,
                confirmButtonText: 'Accept',
                denyButtonText: 'Decline'
            }).then(result => {
                if (result.isConfirmed) {
                    socket.emit('pause accept', this.props.room);
                    if (this.state.isMyTurn) {
                        clearInterval(this.interval);
                    }
                    this.setState({
                        isPause: true
                    })
                    Swal.fire({
                        title: 'Paused',
                        allowOutsideClick: false,
                        showConfirmButton: false
                    })
                } else {
                    socket.emit('pause reject', this.props.room);
                }
            })
        })

        socket.on('opponent accept pause', () => {
            Swal.close();
            this.setState({
                isPause: true
            })
            if (this.state.isMyTurn) {
                clearInterval(this.interval);
            }
        })

        socket.on('opponent reject pause', () => {
            Swal.close();
            Swal.fire({
                title: 'Rejected',
                icon: 'warning'
            })
        })

        socket.on('opponent resume', () => {
            Swal.close();
            if (this.state.isMyTurn) {
                this.interval = setInterval(() => this.tick(), 1000);
            }
            this.setState({
                isPause: false
            })
        })

        socket.on('receive chat', msg => {
            let arr = this.state.chat.slice();
            arr.push(msg);
            this.setState({
                chat: arr
            }, () => {
                let chatbox = document.getElementById("chat-box");
                var xH = chatbox.scrollHeight;
                chatbox.scrollTo(0, xH);
            })
            this.forceUpdate();
        })

        socket.on('secret key', () => {
            this.setState({
                secretSong: false
            }, () => {
                this.setState({
                    secretSong: true
                })
            })
        })

        socket.on('update enemy grid', payload => {
            clearInterval(this.interval);
            this.setState({
                enemyData: payload.data,
                score: payload.score,
                isMyTurn: false,
                seconds: 0
            })
        })

        socket.on('update my grid', data => {
            let newData = this.state.data.slice();
            for (let i = 0; i < data.length; i++) {
                if (data[i] === 2 || data[i] === 3) {
                    newData[i] = data[i];
                }
            }
            clearInterval(this.interval);
            this.setState({
                data: newData,
                isMyTurn: true,
                seconds: 10
            })
            this.interval = setInterval(() => this.tick(), 1000);
        })

        socket.on('missile not enough', () => {
            Swal.fire({
                title: 'Oops',
                text: 'You don\'t have enough item or already used the item in this round',
                icon: 'error'
            })
        })

        socket.on('used missile', () => {
            socket.emit('update missile', localStorage.getItem('auth'));
        })

        socket.on('glasses result found', data => {
            this.setState({
                enemyData: data
            });
            Swal.fire({
                title: 'You found a ship, Destroy them!'
            })
        })

        socket.on('glasses result not found', data => {
            this.setState({
                enemyData: data
            });
            Swal.fire({
                title: 'You found nothing, it is marked'
            })
        })

        socket.on('end game', payload => {
            clearInterval(this.interval);
            if (payload.winner.auth === localStorage.getItem('auth')) {
                socket.emit('update points', {
                    auth: payload.winner.auth,
                    score: payload.winner.score
                });
                socket.emit('update pocket', payload.winner.auth);
                this.state.audio[3].currentTime = 0;
                this.state.audio[3].play();
                Swal.fire({
                    title: 'Congratulations!',
                    html: 'You <b>won</b> the game<br>Score: <b>' + payload.winner.score
                        + '</b> Points<br>Reward: <b>200</b> Coins<br><br>Enemy <b>' + this.state.enemyName
                        + '</b> score: ' + this.state.enemyScore,
                    imageUrl: '/win.png',
                    imageWidth: 256,
                    imageHeight: 256,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 10000
                }).then(result => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        Swal.fire({
                            text: 'Play again?',
                            showDenyButton: true,
                            allowOutsideClick: false,
                            confirmButtonText: 'Continue',
                            denyButtonText: 'Exit'
                        }).then(result => {
                            if (result.isConfirmed) {
                                socket.emit('play again request', this.props.room);
                                Swal.fire({
                                    title: 'Waiting for opponent',
                                    allowOutsideClick: false,
                                    showConfirmButton: false,
                                    willOpen: () => {
                                        Swal.showLoading();
                                    }
                                })
                            } else {
                                window.location.reload();
                            }
                        })
                    }
                })
            } else {
                socket.emit('update points', {
                    auth: localStorage.getItem('auth'),
                    score: payload.loser.score
                });
                this.state.audio[4].currentTime = 0;
                this.state.audio[4].play();
                Swal.fire({
                    title: 'Uhh!',
                    html: 'You <b>lose</b> the game<br>Scored: <b>' + payload.loser.score
                        + '</b> Points<br>Reward: <b>0</b> Coins<br><br>Enemy <b>' + this.state.enemyName
                        + '</b> score: ' + this.state.enemyScore,
                    imageUrl: '/lose.png',
                    imageWidth: 256,
                    imageHeight: 256,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 10000
                }).then(result => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        Swal.fire({
                            text: 'Play again?',
                            showDenyButton: true,
                            allowOutsideClick: false,
                            confirmButtonText: 'Continue',
                            denyButtonText: 'Exit'
                        }).then(result => {
                            if (result.isConfirmed) {
                                socket.emit('play again request', this.props.room);
                                Swal.fire({
                                    title: 'Waiting for opponent',
                                    allowOutsideClick: false,
                                    showConfirmButton: false,
                                    willOpen: () => {
                                        Swal.showLoading();
                                    }
                                })
                            } else {
                                window.location.reload();
                            }
                        })
                    }
                })
            }
        })

        socket.on('opponent want to play again', () => {
            Swal.fire({
                text: this.state.enemyName + ' want to play again',
                showDenyButton: true,
                allowOutsideClick: false,
                confirmButtonText: 'Accept',
                denyButtonText: 'Decline'
            }).then(result => {
                if (result.isConfirmed) {
                    socket.emit('play again accept', this.props.room);
                    this.resetState();
                } else {
                    window.location.reload();
                }
            })
        })

        socket.on('opponent accept play again', () => {
            this.resetState();
            Swal.close();
        })
    }

    render() {
        let PlanningStage = (
            <Container style={{ paddingTop: '2%', minWidth: '600px' }}>
                <Row>
                    <Col>
                        <Navbar bg="dark" variant="dark" style={{ borderRadius: '10px 10px 0 0' }}>
                            <Navbar.Collapse>
                                <Nav className="container-fluid">
                                    <Navbar.Text className="ml-auto mr-auto" style={{ color: 'white', fontSize: '18px' }}>
                                        Place Your Ships ㋡
                                </Navbar.Text>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                        <Card style={{ backgroundColor: '#e9ecef', borderRadius: '0 0 10px 10px' }}>
                            <Card.Body>
                                <Row>
                                    <Col lg={9} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                        {this.renderPlanBoard().map(each => (<div className="board-row">{each}</div>))}
                                    </Col>
                                    <Col lg={3}>
                                        <Row style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px', marginBottom: '10px' }}>
                                            <Card style={{ width: '100%' }}>
                                                <Card.Body>
                                                    <Button variant='info' block onClick={() => this.changeAlign('hori')}>Horizontal</Button>
                                                    <Button variant='info' block onClick={() => this.changeAlign('vert')}>Vertical</Button>
                                                </Card.Body>
                                            </Card>
                                        </Row>
                                        <Row style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '10px' }} className="text-center">
                                            <Card style={{ width: '100%' }}>
                                                <Card.Header>
                                                    <Card.Text>Ship amount</Card.Text>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Card.Text style={{ marginBottom: '-20px', marginTop: '-20px', fontSize: '50px' }}>
                                                        {this.state.shipAmount}
                                                    </Card.Text>
                                                    <Card.Text>to be placed</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Row>
                                        <Row style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '10px' }}>
                                            <Card style={{ width: '100%' }}>
                                                <Card.Body>
                                                    <Button variant='primary' block onClick={() => this.next()}>Next</Button>
                                                    <Button variant='danger' block onClick={() => this.back()} disabled={!this.state.controlButton}>Back</Button>
                                                </Card.Body>
                                            </Card>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );

        let GamingStage = (
            <Container style={{ paddingTop: '2%', minWidth: '1100px' }}>
                {this.state.secretSong && (<iframe width="0" height="0" style={{ display: 'none' }} src="https://www.youtube.com/embed/jveH6adL5DY?controls=0&autoplay=1&loop=true" frameborder="0" allowfullscreen></iframe>)}
                <Row >
                    <Col>
                        <Navbar bg="dark" variant="dark" style={{ borderRadius: '10px 10px 0 0' }}>
                            <Navbar.Collapse>
                                <Nav className="container-fluid">
                                    {!this.state.isPause ?
                                        (<Nav.Link onClick={() => this.pause()}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <BsFillPauseFill style={{ marginRight: '5px' }} /> Pause
                                    </div>
                                        </Nav.Link>)
                                        :
                                        (<Nav.Link onClick={() => this.resume()}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                < BsFillPlayFill style={{ marginRight: '5px' }} /> Resume
                                    </div>
                                        </Nav.Link>)
                                    }
                                    <Navbar.Text className="ml-auto">
                                        <div style={{ marginTop: '3px' }} >
                                            <h5>
                                                <Badge style={{ width: '500px' }} variant={this.state.isPause ? 'light' : this.state.isMyTurn ? 'success' : 'danger'} >
                                                    {this.state.isPause ? (<>Paused</>) : this.state.isMyTurn ? (<>Your Turn</>) : (<>Enemy Turn</>)}
                                                </Badge>
                                            </h5>
                                        </div>
                                    </Navbar.Text>
                                    <Nav.Link className="ml-auto" style={{ color: 'white' }}>
                                        {this.state.name} : {this.state.score} Points<br></br>
                                        {this.state.enemyName} : {this.state.enemyScore} Points
                                </Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                        <Card style={{ backgroundColor: '#e9ecef', borderRadius: '0 0 10px 10px' }}>
                            <Card.Body>
                                <Row>
                                    <Col lg={4} style={{ marginTop: '10px', marginBottom: '10px' }}>
                                        {this.renderMyBoard().map(each => (<div className="board-row">{each}</div>))}
                                    </Col>
                                    <Col lg={4} style={{ marginTop: '10px', marginBottom: '10px' }}>
                                        {this.renderEnemyBoard().map(each => (<div className="board-row">{each}</div>))}
                                    </Col>
                                    <Col lg={4}>
                                        <Card border="primary" style={{ width: '100%', height: '350px' }}>
                                            <Card.Header>Chat</Card.Header>
                                            <Card.Body id="chat-box" style={{ height: '150px', overflowY: 'scroll' }}>
                                                {this.state.chat.map(each => (
                                                    <p>{each}</p>
                                                ))}
                                            </Card.Body>
                                            <Card.Footer>
                                                <InputGroup size="sm">
                                                    <FormControl id="chat-input" onChange={e => this.handleChat(e)} onKeyPress={e => this.handleKey(e)} aria-describedby="basic-addon1" style={{ marginTop: '5px' }} />
                                                    <InputGroup.Append>
                                                        <Button variant="outline-secondary" size="sm" onClick={() => this.send()}>Send</Button>
                                                    </InputGroup.Append>
                                                </InputGroup>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>
                                        <Card style={{ width: '100%', marginTop: '10px', height: '100%' }}>
                                            <Card.Body>
                                                <Row>
                                                    <Col>
                                                        <Card.Title>Items</Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted">Missile quota: once per game</Card.Subtitle>
                                                        <Card.Subtitle className="mb-2 text-muted">Glasses quota: twice per game</Card.Subtitle>
                                                        <Card.Subtitle className="mb-2 text-muted"><br></br>Use them wisely</Card.Subtitle>
                                                    </Col>
                                                    <Col style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                        <Button variant='info' block disabled={this.state.isUsingMissile || this.state.missileAvai === 0} onClick={() => this.equipMissile()}><IoIosRocket style={{ marginRight: '5px' }} />Five-shot Missile</Button>
                                                        <Button variant='info' block disabled={this.state.isPause || !this.state.isMyTurn || this.state.isUsingMissile || this.state.radarAvai === 0} onClick={() => this.useGlasses()}><BiGlasses style={{ marginRight: '5px' }} />Glasses</Button>
                                                        <Button variant='danger' block disabled={!this.state.isUsingMissile} onClick={() => this.cancelMissile()}>Cancel</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col lg={4} className="text-center">
                                        <Card style={{ width: '100%', marginTop: '10px', height: '100%' }}>
                                            <Card.Body>
                                                <Card.Title>Time remaining</Card.Title>
                                                <Card.Text style={{ marginBottom: '-20px', fontSize: '70px' }}>
                                                    {this.state.seconds}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )

        return this.state.isPlanningStage ? PlanningStage : GamingStage;
    }
}

export default Game;