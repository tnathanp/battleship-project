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
    return localStorage.getItem('isLogin') === 'true';
  }

  logged(name) {
    Swal.fire("Hello, " + name);
    this.forceUpdate();
  }

  startGame() {
    this.setState({ isInGame: true });
  }

  componentDidMount() {
    //ask server
    document.body.style.backgroundImage=("linear-gradient(43deg, #4158D0 0%, #C850C0 51%, #FFCC70 100%");
}
  
  audio1 = new Audio("/Pirates Of The Caribbean Theme Song.mp3");
  audio2 = new Audio("/Coffin Dance (Official Music Video HD).mp3");
  audio3 = new Audio("/Pink Panther Theme Song.mp3");

  controlSong(x) {
    if (x === 1) {
      this.audio1.pause();
      this.audio1.currentTime = 0;
      this.audio2.pause();
      this.audio2.currentTime = 0;
      this.audio3.pause();
      this.audio3.currentTime = 0;
      this.audio1.play();
      this.audio1.loop = true;
    } else if (x === 2) {
      this.audio1.pause();
      this.audio1.currentTime = 0;
      this.audio2.pause();
      this.audio2.currentTime = 0;
      this.audio3.pause();
      this.audio3.currentTime = 0;
      this.audio2.play();
      this.audio2.loop = true;
    } else if (x === 3) {
      this.audio1.pause();
      this.audio1.currentTime = 0;
      this.audio2.pause();
      this.audio2.currentTime = 0;
      this.audio3.pause();
      this.audio3.currentTime = 0;
      this.audio3.play();
      this.audio3.loop = true;
    } else {
      this.audio1.pause();
      this.audio1.currentTime = 0;
      this.audio2.pause();
      this.audio2.currentTime = 0;
      this.audio3.pause();
      this.audio3.currentTime = 0;
    }
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