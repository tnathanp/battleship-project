import React from 'react';
import server from 'socket.io-client';
import { Image, Row, Col, Container, FormControl, InputGroup, Jumbotron, Button } from 'react-bootstrap';
import { BsFillPersonFill, BsFillLockFill } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';

class LoginModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      form: {}
    }
  }

  handleChange(e) {
    let fieldName = e.target.name;
    let fleldVal = e.target.value;
    this.setState({form: {...this.state.form, [fieldName]: fleldVal}})
  }

  login() {
    //check with server
    if(this.state.form.user === 'admin' && this.state.form.pass === '123') {
      localStorage.removeItem('isLogin');
      localStorage.setItem('isLogin', true);
      this.props.logged();
    } else {
      localStorage.setItem('isLogin', false);
    }
  }

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
                  <FormControl name="user" placeholder="Username" onChange={e => this.handleChange(e)}/>
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <BsFillLockFill />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl name="pass" type="password" placeholder="Password" onChange={e => this.handleChange(e)}/>
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