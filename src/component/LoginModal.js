import React from 'react';
import server from 'socket.io-client';
import { Image, Row, Col, Container, FormControl, InputGroup, Jumbotron, Button } from 'react-bootstrap';
import { BsFillPersonFill, BsFillLockFill } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';

class LoginModal extends React.Component {
  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col></Col>
          <Col xs={6}>
            <Jumbotron>
              <div class="text-center">
                <Image style={{ width: '100%', marginBottom: '-30px' }} src="https://www.tgpl.in.th/wp-content/uploads/2016/01/battleship.png" />

                <h1>Eiei Battleship</h1>

                <Button variant="outline-secondary" style={{ marginBottom: '20px' }}>
                  <Image style={{ width: '80px', height: '80px' }} src="https://image.winudf.com/v2/image1/Y29tLmlubmVyc2xvdGguc3BhY2VtYWZpYV9pY29uXzE1NTQ5MzY1NjJfMDEz/icon.png?w=170&fakeurl=1" thumbnail />
                </Button>

                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <BsFillPersonFill />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl placeholder="Username" />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <BsFillLockFill />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl type="password" placeholder="Password" />
                </InputGroup>

                <Button variant="outline-secondary">Startนะจ๊ะ</Button>{' '}
              </div>
            </Jumbotron>
          </Col>
          <Col></Col>
        </Row>
      </Container>

    )
  }
}

export default LoginModal;