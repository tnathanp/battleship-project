import React from 'react';
import socket from '../connection';
import Swal from 'sweetalert2';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Shop extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pocket: 100,
            missileOwned: 0,
            glassesOwned: 0
        }
    }

    fiveShotBuy(n) {
        if (this.state.pocket < 100 * n) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "You don't have enough money"
            })
            return
        }
        this.setState({
            missileOwned: this.state.missileOwned + n,
            pocket: this.state.pocket - (100 * n)
        })
    }

    glassesBuy(n) {
        if (this.state.pocket < 50 * n) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "You don't have enough money"
            })
            return
        }
        this.setState({
            glassesOwned: this.state.glassesOwned + n,
            pocket: this.state.pocket - (50 * n)
        })
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Card style={{ marginBottom: '10px' }}>
                            <Card.Body>Pocket: {this.state.pocket}</Card.Body>
                        </Card>
                        <Row >
                            <Col >
                                <Card >
                                    <Card.Body class="text-center">
                                        <Card.Img variant="top" style={{ width: '50%' }} src="https://media.istockphoto.com/vectors/startup-icon-vector-id1074164928?k=6&m=1074164928&s=612x612&w=0&h=dD2gAKmO5MNG-eOh2WE34ZMoLSpF0j_YSYvTFKl-FfA=" />
                                        <Card.Title style={{ marginTop: '20px' }} >Five-shot Missile</Card.Title>
                                        <Card.Text style={{ marginBottom: '20px' }}>Strike five squares in a cross pattern on the grid in one turn</Card.Text>
                                        <Card.Text>Currently owned: {this.state.missileOwned}</Card.Text>
                                        <Card.Text style={{ marginTop: '-15px' }}>Price: 100</Card.Text>
                                        <Card.Text style={{ marginBottom: '0px' }}>Purchase:</Card.Text>
                                        <Button onClick={() => this.fiveShotBuy(1)} variant="outline-primary" style={{ width: '100px', marginRight: '10px' }}>X1</Button>
                                        <Button onClick={() => this.fiveShotBuy(10)} variant="outline-primary" style={{ width: '100px' }}>X10</Button>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col>
                                <Card style={{ height: '100%' }}> 
                                    <Card.Body class="text-center">
                                        <Card.Img variant="top" style={{ width: '50%' }} src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-glasses-outline-512.png" />
                                        <Card.Title style={{ marginTop: '20px' }} >Glasses</Card.Title>
                                        <Card.Text style={{ marginBottom: '20px' }}>Randomly unviel one square</Card.Text>
                                        <Card.Text style={{marginTop: '45px' }}>Currently owned: {this.state.glassesOwned}</Card.Text>
                                        <Card.Text style={{ marginTop: '-15px' }}>Price: 50</Card.Text>
                                        <Card.Text style={{ marginBottom: '0px' }}>Purchase:</Card.Text>
                                        <Button onClick={() => this.glassesBuy(1)} variant="outline-primary" style={{ width: '100px', marginRight: '10px' }}>X1</Button>
                                        <Button onClick={() => this.glassesBuy(10)} variant="outline-primary" style={{ width: '100px' }}>X10</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Shop;