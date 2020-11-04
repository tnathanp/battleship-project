import React from 'react';
import socket from '../connection';
import { Row, Col, Container, Card, Navbar, Nav, Button, InputGroup, FormControl, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { BsFillPauseFill } from 'react-icons/bs'
import { IoIosRocket } from 'react-icons/io'
import { BiGlasses } from 'react-icons/bi'
import './Game.css';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            chat: [],
            seconds: 10
        }
    }

    renderBoard() {
        let board = []
        for (let row = 1; row <= 8; row++) {
            let elem = []
            for (let column = 1; column <= 8; column++) {
                elem.push((<Square value={column} />));
            }
            board.push(elem);
        }
        return board;
    }

    tick() {
        this.setState(state => ({
            seconds: state.seconds - 1
        }));

        //add message to chatbox
        this.state.chat.push(this.state.seconds);
        let chatbox = document.getElementById("chat-box");
        chatbox.scrollTop = chatbox.offsetHeight;

        if (this.state.seconds === 0) {
            clearInterval(this.interval)
            Swal.fire({
                text: 'Time out',
            })
        }
    }

    render() {
        return (
            <Container style={{ paddingTop: '2%' }}>
                <Row>
                    <Col>
                        <Navbar bg="dark" variant="dark" expand="lg" style={{ borderRadius: '10px 10px 0 0' }}>
                            <Navbar.Collapse>
                                <Nav>
                                    <Nav.Link >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <BsFillPauseFill style={{ marginRight: '5px' }} /> Pause
                                        </div>
                                    </Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                        <Card style={{ backgroundColor: '#e9ecef', borderRadius: '0 0 10px 10px' }}>
                            <Card.Body>
                                <Row>
                                    <Col xs={4} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                        {this.renderBoard().map(each => (<div className="board-row">{each}</div>))}
                                    </Col>
                                    <Col xs={4} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                        {this.renderBoard().map(each => (<div className="board-row">{each}</div>))}
                                    </Col>
                                    <Col xs={4}>
                                        <Card border="primary" style={{ width: '100%', height: '350px'}}>
                                            <Card.Header>Chat</Card.Header>
                                            <Card.Body id="chat-box" style={{ height: '150px', overflowY: 'scroll' }}>
                                                {this.state.chat.map(each => (
                                                    <p>{each}</p>
                                                ))}
                                            </Card.Body>
                                            <Card.Footer>
                                                <InputGroup size="sm">
                                                    <FormControl aria-describedby="basic-addon1" style={{ marginTop: '5px' }} />
                                                    <InputGroup.Append>
                                                        <Button variant="outline-secondary" size="sm">Send</Button>
                                                    </InputGroup.Append>
                                                </InputGroup>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={8}>
                                        <Card style={{ width: '100%', marginTop: '10px', height: '100%' }}>
                                            <Card.Body>
                                                <Row>
                                                    <Col>
                                                        <Card.Title>Items</Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted">Missile quota: one per game</Card.Subtitle>
                                                        <Card.Subtitle className="mb-2 text-muted">Glasses quota: twice per game</Card.Subtitle>
                                                        <Card.Subtitle className="mb-2 text-muted"><br></br>Use them wisely</Card.Subtitle>
                                                    </Col>
                                                    <Col style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                                        <Button variant='info' block><IoIosRocket style={{ marginRight: '5px' }} />Five-shot Missile</Button>
                                                        <Button variant='info' block><BiGlasses style={{ marginRight: '5px' }} />Glasses</Button>
                                                        <Button variant='danger' disabled='true' block>Cancel</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col xs={4} className="text-center">
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
        );
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }
}

class Square extends React.Component {
    render() {
        return (
            <button className="square">
                {this.props.value}
            </button>
        );
    }
}

export default Game;