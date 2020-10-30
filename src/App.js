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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.logged = this.logged.bind(this);
    this.state = {
      isInGame: false
    }
  }

  isAuthenticated() {
    if (localStorage.getItem('isLogin') === 'true') {
      socket.emit('online', localStorage.getItem('auth'));
      return true;
    }
    return false;
  }

  logged(name) {
    Swal.fire("Hello " + name);
    this.forceUpdate();
  }

  startGame() {
    this.setState({ isInGame: true });
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.beforeunload.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.beforeunload.bind(this));
  }

  beforeunload(e) {
    //emit ออกไปเฉยๆว่า ออกเกม ให้ server handle room ด้วย
    socket.emit('offline', localStorage.getItem('auth'));
  }

  render() {
    return (
      <Container style={{ paddingTop: '2%' }}>
        <Row>
          <Button onClick={() => this.startGame()}>Test start game</Button>
          {this.isAuthenticated() ? this.state.isInGame ? (<Game />) : (<Home />) : (<Login logged={this.logged} />)}
        </Row>
      </Container>
    );
  }
}

class Home extends React.Component {
  render() {
    return (
      <Col>
        <Menu />
        <Card style={{ backgroundColor: '#e9ecef', borderRadius: '0 0 10px 10px' }}>
          <Card.Body>
            <Router>
              <Switch>
                <Route path="/rank">
                  <Ranking />
                </Route>
                <Route path="/shop">
                  <Shop />
                </Route>
                <Route path="/">
                  <Lobby />
                </Route>
              </Switch>
            </Router>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

export default App;