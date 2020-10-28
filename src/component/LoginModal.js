import React from 'react';
import server from 'socket.io-client';
import { Image, Row, Col, Container, FormControl, InputGroup, Jumbotron, Button, Modal, Card } from 'react-bootstrap';
import { BsFillPersonFill, BsFillLockFill } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileChoice from './ProfileChoice';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.passPic = this.passPic.bind(this);
    this.state = {
      form: {},
      showProfileChoice: false,
      currentPic: 'https://ih1.redbubble.net/image.1573052278.8041/st,small,507x507-pad,600x600,f8f8f8.u1.jpg'
    }
  }

  handleChange(e) {
    let fieldName = e.target.name;
    let fleldVal = e.target.value;
    this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } })
  }

  login() {
    //check with server
    if (this.state.form.user === 'admin' && this.state.form.pass === '123') {
      localStorage.removeItem('isLogin');
      localStorage.setItem('isLogin', true);
      this.props.logged();
    } else {
      localStorage.setItem('isLogin', false);
    }
  }

  clickProfileChoice() {
    this.setState({ showProfileChoice: !this.state.showProfileChoice })
  }

  passPic(url) {
    this.setState({
      currentPic: url
    });
    this.props.currentPic(url);
    this.clickProfileChoice();
  }

  render() {
    const modalProfileChoice = (
      <Modal centered size="lg" show="true">
        <Modal.Header><Modal.Title>Choose Profile Picture</Modal.Title></Modal.Header>
        <Modal.Body>
          <Container><Row><Col><Card><Card.Header><Card.Body><Card.Text>
            <ProfileChoice currentPic={this.passPic} />
          </Card.Text></Card.Body></Card.Header></Card></Col></Row></Container>
        </Modal.Body>
      </Modal>
    );

    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col></Col>
          <Col xs={6}>
            <Jumbotron>
              <div class="text-center">
                <Image style={{ width: '100%', marginBottom: '-30px' }} src="https://www.tgpl.in.th/wp-content/uploads/2016/01/battleship.png" />

                <h1>Eiei Battleship</h1>

                <Button variant="outline-secondary" style={{ marginBottom: '20px' }} onClick={() => this.clickProfileChoice()}>
                  <Image style={{ width: '80px', height: '80px' }} src={this.state.currentPic} thumbnail />
                </Button>

                {this.state.showProfileChoice && modalProfileChoice}

                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <BsFillPersonFill />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl name="user" placeholder="Username" onChange={e => this.handleChange(e)} />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <BsFillLockFill />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl name="pass" type="password" placeholder="Password" onChange={e => this.handleChange(e)} />
                </InputGroup>

                <Button variant="outline-secondary" onClick={() => this.login()}>Login</Button>{' '}
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