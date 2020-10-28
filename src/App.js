import React from 'react';
import server from 'socket.io-client';
import { Row, Col, Container, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Swal from 'sweetalert2';
import Menu from './component/Menu';
import Lobby from './component/Lobby';
import Ranking from './component/Ranking';
import LoginModal from './component/LoginModal';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.logged = this.logged.bind(this);
    this.state = {}
  }

  isAuthenticated() {
    if(localStorage.getItem('isLogin') === 'true'){
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

  render() {
    return (
      <Container style={{ paddingTop: '2%' }}>
        <Row>
          {this.isAuthenticated() ? (<Home/>) : (<LoginModal logged={this.logged}/>)}
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
                  <h1>WIP</h1>
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