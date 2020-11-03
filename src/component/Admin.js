import React from 'react';
import socket from '../connection';
import Swal from 'sweetalert2';
import { Row, Col, Card, Button, Container, Image, Table, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            admin: 0,
            showRoomID: false
        }
    }

    controlRoomID() {
        this.setState({ showRoomID: !this.state.showRoomID });
    }

    admin(key, action) {
        if (action === 'add money') {
            socket.emit('add money', key);
        } else if (action === 'kick') {
            socket.emit('kick', key);
        } else if (action === 'reset points') {
            socket.emit('reset points', key);
        } else if (action === 'reset room') {
            socket.emit('reset room', key);
        }
    }

    componentDidMount() {
        socket.emit('admin authorization', localStorage.getItem('auth'));

        socket.on('update admin console', () => {
            socket.emit('admin authorization', localStorage.getItem('auth'));
        })

        socket.on('admin authorized', data => {
            Swal.close();
            this.setState({
                admin: 1,
                data: data
            })
        })

        socket.on('restricted access', () => {
            Swal.close();
            this.setState({ admin: 2 });
        })

    }

    render() {
        let result;
        if (this.state.admin === 0) {
            Swal.fire({
                title: 'Loading',
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading()
                }
            })
        } else if (this.state.admin === 1) {
            result = (
                <Row>
                    <Col>
                        <Card className="text-center">
                            <Card.Body>
                                <Button variant='light' block onClick={() => this.controlRoomID()}>Show/Hide Room ID</Button>
                                <Table responsive striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Profile</th>
                                            <th>Name</th>
                                            <th>Points</th>
                                            <th>Money</th>
                                            <th>Room</th>
                                            <th>Control</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.data.map(user => (
                                            <tr>
                                                <td><Image style={{ width: '80px', height: '80px' }} src={user.profile} /></td>
                                                <td>{user.user}</td>
                                                <td>{user.points}</td>
                                                <td>{user.pocket}</td>
                                                <td>
                                                    {user.room === '' ? (<>-</>) :
                                                        this.state.showRoomID === true ? user.room : (<>Yes</>)
                                                    }
                                                </td>
                                                <td>
                                                    <Row>
                                                        <Col>
                                                            <Button variant='primary' onClick={() => this.admin(user.auth, 'add money')}>Add Money (1000)</Button>{'  '}
                                                            <Button variant='danger' onClick={() => this.admin(user.auth, 'kick')}>Kick</Button>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Button variant='warning' onClick={() => this.admin(user.auth, 'reset points')}>Reset Points</Button>{'  '}
                                                            <Button variant='warning' onClick={() => this.admin(user.room, 'reset room')}>Reset Room</Button>
                                                        </Col>
                                                    </Row>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            );
        } else {
            result = (
                <Container style={{ marginTop: '50px', marginBottom: '50px' }}>
                    <Row className="text-center">
                        <Col>
                            <Image style={{ width: '20%', marginBottom: '10px' }} src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/256/sign-error-icon.png" />
                            <h2>Restricted access</h2>
                        </Col>
                    </Row>
                </Container>
            );
        }

        return (
            <Container>
                {result}
            </Container>
        );
    }
}

export default Admin;