import React from 'react';
import server from 'socket.io-client';
import { Row, Col, Container, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Menu from './component/Menu';
import Lobby from './component/Lobby';
import Ranking from './component/Ranking';

class App extends React.Component {
  render() {
    return (
      <Container style={{ paddingTop: '2%' }}>
        <Row>
          <Col>
            <Menu />
            <Card style={{backgroundColor: '#e9ecef', borderRadius: '0 0 10px 10px'}}>
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
        </Row>
      </Container>
    );
  }
}

export default App;