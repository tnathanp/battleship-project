import React from 'react';
import socket from '../connection';
import { Image, Row, Col, Container, FormControl, InputGroup, Button, Modal, Card } from 'react-bootstrap';
import { BsFillPersonFill, BsFillLockFill } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import ProfileChoice from './ProfileChoice';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.changePic = this.changePic.bind(this);
    this.state = {
      form: {
        user: '',
        pass: '',
        profile: 'https://ih1.redbubble.net/image.1573052278.8041/st,small,507x507-pad,600x600,f8f8f8.u1.jpg'
      },
      showProfileChoice: false
    }
  }

  handleChange(e) {
    let fieldName = e.target.name;
    let fleldVal = e.target.value;
    this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } })
  }

  handleKey(e) {
    if (e.key === 'Enter') {
      this.login();
    }
  }

  login() {
    if (this.state.form.user === '' || this.state.form.pass === '') {
      Swal.fire({
        title: 'Empty field',
        icon: 'error'
      });
      localStorage.setItem('isLogin', false);
    } else {
      socket.emit('login', this.state.form);
    }
  }

  clickProfileChoice() {
    this.setState({ showProfileChoice: !this.state.showProfileChoice })
  }

  changePic(url) {
    this.setState({
      form: {
        user: this.state.form.user,
        pass: this.state.form.pass,
        profile: url
      }
    });
    this.clickProfileChoice();
  }

  componentDidMount() {
    socket.on('success login', auth => {
      localStorage.removeItem('auth');
      localStorage.setItem('auth', auth);
      localStorage.removeItem('isLogin');
      localStorage.setItem('isLogin', true);
      this.props.logged(this.state.user);
    });

    socket.on('fail login', () => {
      Swal.fire({
        title: 'Failed',
        text: 'Wrong username or password',
        icon: 'error'
      });
      localStorage.setItem('isLogin', false);
    })
  }

  render() {
    const modalProfileChoice = (
      <Modal centered size="lg" show="true" backdrop="static">
        <Modal.Header><Modal.Title>Choose Profile Picture</Modal.Title></Modal.Header>
        <Modal.Body>
          <Container><Row><Col><Card><Card.Header><Card.Body><Card.Text>
            <ProfileChoice currentPic={this.changePic} />
          </Card.Text></Card.Body></Card.Header></Card></Col></Row></Container>
        </Modal.Body>
      </Modal>
    );

    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col></Col>
          <Col md={6}>
            <Card style={{ backgroundColor: '#e9ecef', borderRadius: '10px' }}>
              <div class="text-center">
                <Card.Body>

                  <Image style={{ width: '100%', marginBottom: '-30px' }} src="https://www.tgpl.in.th/wp-content/uploads/2016/01/battleship.png" />

                  <h1>Eiei Battleship</h1>

                </Card.Body>
                <Card.Footer>
                  <Row>
                    <Col md={4}>

                      <Button variant="outline-secondary" size="sm" style={{ marginBottom: '20px' }} onClick={() => this.clickProfileChoice()}>
                        <Image style={{ width: '80px', height: '80px', marginTop: '5px', marginBottom: '5px' }} src={this.state.form.profile} thumbnail />
                      </Button>
                      {this.state.showProfileChoice && modalProfileChoice}

                    </Col>
                    <Col>

                      <InputGroup className="mb-3" style={{ marginTop: '10px' }}>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <BsFillPersonFill />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl name="user" placeholder="Username" size="md" onChange={e => this.handleChange(e)} />
                      </InputGroup>

                      <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <BsFillLockFill />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl name="pass" type="password" placeholder="Password" onChange={e => this.handleChange(e)} onKeyPress={e => this.handleKey(e)} />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Button block variant="success" onClick={() => this.login()}>Login</Button>
                </Card.Footer>
              </div>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>

    )
  }
}

export default Login;