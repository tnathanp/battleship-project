import React from 'react';
import socket from './connection';
import { Row, Col, Container, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Swal from 'sweetalert2';
import Menu from './component/Menu';
import Lobby from './component/Lobby';
import Ranking from './component/Ranking';
import Login from './component/Login';
import Game from './component/Game';
import Shop from './component/Shop';
import Admin from './component/Admin';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.logged = this.logged.bind(this);
    this.state = {
      isInGame: false
    }
  }

  isAuthenticated() {
    return localStorage.getItem('isLogin') === 'true';
  }

  logged(name) {
    Swal.fire({
      title: "Hello, " + name,
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1500
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        window.location.reload();
      }
    });
  }

  startGame() {
    this.setState({ isInGame: true });
  }

  render() {
    return (
      <Router>
        <Container style={{ paddingTop: '2%' }}>
          <Row>
            <Button onClick={() => this.startGame()}>Test start game</Button>
            {this.isAuthenticated() ? this.state.isInGame ? (<Game />) : (<Home />) : (<Login logged={this.logged} />)}
          </Row>
        </Container>
      </Router>
    );
  }
}

class Home extends React.Component {
  render() {
    return (
      <Col>
        <Switch>
          <Route path="/admin">
            <Menu />
            <Card style={{ backgroundColor: '#e9ecef', borderRadius: '0 0 10px 10px' }}>
              <Card.Body>
                <Admin />
              </Card.Body>
            </Card>
          </Route>
          <Route path="/rank">
            <Menu />
            <Card style={{ backgroundColor: '#e9ecef', borderRadius: '0 0 10px 10px' }}>
              <Card.Body>
                <Ranking />
              </Card.Body>
            </Card>
          </Route>
          <Route path="/shop">
            <Menu />
            <Card style={{ backgroundColor: '#e9ecef', borderRadius: '0 0 10px 10px' }}>
              <Card.Body>
                <Shop />
              </Card.Body>
            </Card>
          </Route>
          <Route path="/">
            <Menu />
            <Card style={{ backgroundColor: '#e9ecef', borderRadius: '0 0 10px 10px' }}>
              <Card.Body>
                <Lobby />
              </Card.Body>
            </Card>
          </Route>
        </Switch>
      </Col>
    );
  }
}

export default App;