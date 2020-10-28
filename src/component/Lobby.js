import React from 'react';
import server from 'socket.io-client';
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
            showInviteFriend: false,
            showCreateRoom: false
        }
    }

    modalControl(_type, action) {
        switch (_type) {
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

    createRoom() {
        //send create room data to server
    }

    invite() {
        //send invitation to server
    }

    refresh() {
        //get new list from server
        let list = []
        for (let i = 0; i < 5; i++) {
            list.push(Math.floor(Math.random() * 101))
        }
        this.setState({
            roomList: list
        })
    }

    roomSelected(roomNum) {
        //send selected room number to server
        //start game
    }

    componentDidMount() {
        //get list from server
        let list = [1, 2, 3, 4, 5]
        this.setState({
            roomList: list
        })
    }

    render() {
        const modalInviteFriend = (
            <Modal centered size="lg" show="true">
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
                    <Button variant="primary" onClick={() => this.invite()}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        );

        const modalCreateRoom = (
            <Modal centered size="lg" show="true">
                <Modal.Header><Modal.Title>Create Room</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Container><Row><Col><Card><Card.Header><Card.Body><Card.Text>
                        <Form>
                            WIP
                            </Form>
                    </Card.Text></Card.Body></Card.Header></Card></Col></Row></Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.modalControl('cr', false)}>Close</Button>
                    <Button variant="primary" onClick={() => this.createRoom()}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        );

        return (
            <Container>

                {this.state.showInviteFriend && modalInviteFriend}
                {this.state.showCreateRoom && modalCreateRoom}

                <Row>
                    <Col>
                        <Card style={{ width: '100%', height: '100%' }}>
                            <Card.Header>
                                Room List
                                <Button className="float-right" variant="warning" size="sm" onClick={() => this.refresh()}><BsArrowClockwise style={{ marginRight: '3px' }} /> refresh</Button>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {this.state.roomList.map(each => (
                                        <Card.Link onClick={() => this.roomSelected(each)}><p>{each}</p></Card.Link>)
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

                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Lobby;
