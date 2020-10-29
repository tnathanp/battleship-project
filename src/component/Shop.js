import React from 'react';
import server from 'socket.io-client';
import Swal from 'sweetalert2';
import { Row, Col, Card, Button, Container, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsPersonPlusFill, BsFillPlusSquareFill, BsArrowClockwise } from "react-icons/bs";


class Shop extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roomList: [],
            friendID: '',
            roomID: '',
            showInviteFriend: false,
            showCreateRoom: false
        }
    }


    render() {
        
     

        return (
            <Container>
                <Row>
                    <Col>
                        <Row>
                            <Col>
                            Item 1
                            </Col>
                        

                        
                            <Col>
                            Item 2
                            </Col>
                        </Row>
                    
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Shop;
