import React from 'react';
import socket from '../connection';
import Swal from 'sweetalert2';
import { Row, Col, Card, Button, Container, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsPersonPlusFill, BsFillPlusSquareFill, BsArrowClockwise } from "react-icons/bs";
import './Lobby.css';

class Lobby extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roomList: [],
            friendID: '',
            roomID: '',
            joinedRoomID: '',
            showInviteFriend: false,
            showCreateRoom: false
        }
    }

    modalControl(t, action) {
        switch (t) {
            case 'if':
                this.setState({ showInviteFriend: action });
                break;
            case 'cr':
                this.setState({ showCreateRoom: action });
                break;
        }
    }

    handleFriendID(e) {
        this.setState({
            friendID: e.target.value
        })
    }

    handleRoomID(e) {
        this.setState({
            roomID: e.target.value
        })
    }

    createRoom() {
        this.modalControl('cr', false);
        socket.emit('create room', this.state.roomID);
    }

    joinRoom(id) {
        socket.emit('join room', id);
        this.setState({
            joinedRoomID: id
        })
    }

    invite() {
        socket.emit('request friend id', this.state.friendID);
    }

    refresh() {
        socket.emit('get room list');
    }

    componentDidMount() {
        socket.emit('get room list');

        socket.on('success create room', id => {
            this.setState({
                joinedRoomID: id
            })
            Swal.fire({
                title: 'Waiting for the opponent',
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            })
        })

        socket.on('receive invitation', room => {
            this.setState({
                joinedRoomID: room
            });
            Swal.fire({
                text: 'You are invited to join a room'
            });
            socket.emit('join invitation', room);
        })

        socket.on('join inivitation success', () => {
            Swal.fire({
                icon: 'success',
                text: "Join success"
            })
        })
        
        socket.on('join invitation fail', () => {
            Swal.fire({
                icon: 'error',
                text: "Join fail"
            })
        })

        socket.on('friend id not found', () => {
            Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: "friend's ID not found"
            })
        })

        socket.on('room id already exist', () => {
            Swal.fire({
                title: 'Room name already exists',
                icon: 'error'
            })
        })

        socket.on('update room list', data => {
            this.setState({
                roomList: data
            })
        })

        socket.on('start the game', () => {
            Swal.close();
            Swal.fire({
                title: 'Game start gooooooooooo',
                icon: 'success'
            })
        })

    }

    render() {
        const modalInviteFriend = (
            <Modal centered size="lg" show="true" backdrop="static">
                <Modal.Header><Modal.Title>Invite Friend</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Container><Row><Col><Card><Card.Header><Card.Body><Card.Text>
                        <Form>
                            <Form.Group>
                                <Form.Label>Friend ID</Form.Label>
                                <Form.Control onChange={e => this.handleFriendID(e)} placeholder="Enter your friend's ID" />
                            </Form.Group>
                        </Form>
                    </Card.Text></Card.Body></Card.Header></Card></Col></Row></Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.modalControl('if', false)}>Close</Button>
                    <Button variant="primary" onClick={() => this.invite()}>Send Invitation</Button>
                </Modal.Footer>
            </Modal>
        );

        const modalCreateRoom = (
            <Modal centered size="lg" show="true" backdrop="static">
                <Modal.Header><Modal.Title>Create Room</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Container><Row><Col><Card><Card.Header><Card.Body><Card.Text>
                        <Form>
                            Room name
                        <Form.Control onChange={e => this.handleRoomID(e)} placeholder="Enter room name" />
                        </Form>
                    </Card.Text></Card.Body></Card.Header></Card></Col></Row></Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.modalControl('cr', false)}>Close</Button>
                    <Button variant="primary" onClick={() => this.createRoom()}>Create</Button>
                </Modal.Footer>
            </Modal>
        );

        return (
            <Container>
                <Row>
                    <Col>
                        <Card style={{ width: '100%', height: '100%' }}>
                            <Card.Header>
                                Room List
                                <Button className="float-right" variant="warning" size="sm" onClick={() => this.refresh()}><BsArrowClockwise style={{ marginRight: '3px' }} /> refresh</Button>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <Button onClick={() => this.test()}>test emit to client in same room</Button>
                                    {this.state.roomList.map(each => (
                                        <Card.Link onClick={() => this.joinRoom(each.roomID)}><p>{each.roomID}</p></Card.Link>)
                                    )}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer className="text-center">

                                <Button variant="primary" onClick={() => this.modalControl('cr', true)}>
                                    <div style={{ display: 'flex', alignItems: "center" }}>
                                        <BsFillPlusSquareFill style={{ marginRight: '10px' }} /> Create Room
                                    </div>
                                </Button>

                                {' '}

                                <Button variant="info" onClick={() => this.modalControl('if', true)}>
                                    <div style={{ display: 'flex', alignItems: "center" }}>
                                        <BsPersonPlusFill style={{ marginRight: '10px' }} /> Invite Friend
                                    </div>
                                </Button>

                                {this.state.showInviteFriend && modalInviteFriend}
                                {this.state.showCreateRoom && modalCreateRoom}

                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Lobby;
