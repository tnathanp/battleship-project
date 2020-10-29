import React from 'react';
import server from 'socket.io-client';
import { Row, Col, Container, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Swal from 'sweetalert2';
import Menu from './component/Menu';
import Lobby from './component/Lobby';
import Ranking from './component/Ranking';
import LoginModal from './component/LoginModal';
import Game from './component/Game';
import Shop from './component/Shop';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.logged = this.logged.bind(this);
    this.picChange = this.picChange.bind(this);
    this.state = {
      user: {
        profile: 'https://ih1.redbubble.net/image.1573052278.8041/st,small,507x507-pad,600x600,f8f8f8.u1.jpg'
      },
      isInGame: false
    }
  }

  isAuthenticated() {
    if (localStorage.getItem('isLogin') === 'true') {
      //auth check with server
      //if valid then return true else false
      return true;
    }
    return false;
  }

  logged() {
    this.forceUpdate();
    Swal.fire("hello");
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
    //disconnect code
    //emit ออกไปเฉยๆว่า ออกเกม ให้ server handle room ด้วย
  }

  picChange(url) {
    this.setState({
      user: {
        profile: url
      }
    });
  }

  render() {
    return (
      <Container style={{ paddingTop: '2%' }}>
        <Row>
          <Button onClick={() => this.startGame()}>Test start game</Button>
          {this.isAuthenticated() ? this.state.isInGame ? (<Game info={this.state.user}/>) : (<Home />) : (<LoginModal logged={this.logged} currentPic={this.picChange} />)}
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