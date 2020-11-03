import React from 'react';
import socket from '../connection';
import { Row, Col, Container, Card, Navbar, Nav, Button, InputGroup, FormControl } from 'react-bootstrap';
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

        if(this.state.seconds === 0){
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
                                    <Col>
                                       
                                        {this.renderBoard().map(each => (<div className="board-row">{each}</div>))} 
                                    </Col>
                                    <Col>
                                        {this.renderBoard().map(each => (<div className="board-row">{each}</div>))}
                                    </Col>
                                    <Col>
                                        <Card style={{ width: '19rem',height: '268px' }}>
                                            <Card.Body>
                                                <Card.Title>Items</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">Use them wisely na ka sis</Card.Subtitle>
                                                <Card.Text>

                                                </Card.Text>
                                                <Button><IoIosRocket style={{ marginRight: '5px' }} />Five-shot Missile</Button>
                                                <Button><BiGlasses style={{ marginRight: '5px' }} />Glasses</Button>
                                               
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>

                                    <Col>
                                        <Card border="primary" style={{width: '40rem', marginTop:'10px',height: '160px'}}>
                                            <Card.Header>Chat</Card.Header>
                                            <Card.Body>
                                                แชทๆๆๆๆ
                                                <InputGroup className="mb-3">
                                                    <FormControl aria-describedby="basic-addon1" style={{marginTop: '5px'}}/>
                                                    <InputGroup.Append>
                                                        <Button variant="outline-secondary">Send</Button>
                                                    </InputGroup.Append>
                                                </InputGroup>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col className= "text-center">
                                        <Card   style={{ width: '19rem',marginTop: '10px',marginLeft: '60px',height: '160px' }}>
                                            <Card.Body>
                                                <Card.Title>Time remaining</Card.Title>
                                                <Card.Text style= {{ fontSize: '70px'}}>
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
        /*
        let timerInterval
        Swal.fire({
            title: 'Time remaining',
            html: '<a></a>',
            timer: 10000,
            timerProgressBar: true,
            backdrop: false,
            willOpen: () => {
                Swal.showLoading()
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
            /* Read more about handling dismissals below 
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
            }
        })*/
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