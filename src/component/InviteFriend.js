import React from 'react';
import server from 'socket.io-client';
import Swal from 'sweetalert2';
import { Row, Col, Card, Button, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class InviteFriend extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: 0
    }
  }
  enterID(id) {
    //send entered friend to server
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                Invite Friend
               <Card.Body>
                  <Card.Text>
                    <Form>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Friend ID</Form.Label>
                        <Form.Control onChange={(id) => this.enterID(id)} placeholder="Enter your friend's ID" />
                      </Form.Group>
                      <Button variant="primary" onClick="">
                        Enter
                      </Button>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card.Header>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default InviteFriend;
