import React from 'react';
import server from 'socket.io-client';
import Swal from 'sweetalert2';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsPersonPlusFill, BsFillPlusSquareFill, BsArrowClockwise } from "react-icons/bs";
import './Lobby.css';
import InviteFriend from './InviteFriend'

class Lobby extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roomList: [],
            ifClickInviteFriend: false
        }
    }
    getList() {
        //get list from server
        let list = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        this.setState({
            roomList: list
        })
    }

    createRoom() {

    }

    inviteFriend() {
        this.setState({
            ifClickInviteFriend: true
        })
    }

    roomSelected(roomNum) {
        //send selected room number to server
        //start game
    }

    refresh() {
        //get new list from server
        let list = []
        for (let i = 0; i < 9; i++) {
            list.push(Math.floor(Math.random() * 101))
        }
        this.setState({
            roomList: list
        })
    }

    render() {
        if (this.state.ifClickInviteFriend == true) {
            return (
                <Row>
                    <Col>
                        <InviteFriend></InviteFriend>
                    </Col>
                </Row>
            )
        } else {
            return (
                <Container>
                    <Row>
                        <Col>
                            <Card style={{ width: '100%', height: '720px' }}>
                                <Card.Header>
                                    Please Select Room
                                <Button className="float-right" variant="primary" size="sm" onClick={() => this.refresh()}><BsArrowClockwise style={{ marginRight: '3px' }} /> refresh</Button>
                                </Card.Header>
                                <Card.Body>

                                    <Card.Text>
                                        {this.state.roomList.map(each => (
                                            <Card.Link onClick={() => this.roomSelected(each)}><p>{each}</p></Card.Link>)
                                        )}
                                    </Card.Text>
                                </Card.Body>

                                <Card.Footer className="text-center">

                                    <Button variant="primary" onClick={() => this.createRoom()}>
                                        <div style={{ display: 'flex', alignItems: "center" }}>
                                            <BsFillPlusSquareFill style={{ marginRight: '10px' }} /> Create Room
                                        </div>
                                    </Button>

                                    {' '}

                                    <Button variant="primary" onClick={() => this.inviteFriend()}>
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

    componentDidMount() {
        this.getList()
    }
}

export default Lobby;
