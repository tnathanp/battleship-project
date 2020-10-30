import React from 'react';
import socket from '../connection';
import { Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IconContext } from 'react-icons';
import { RiVipCrownFill } from 'react-icons/ri';

class Ranking extends React.Component {
  render() {
    return (
      <Row>
        <Col>
          <Tier tier="1" points="1000" />
          <Tier tier="2" points="500" />
          <Tier tier="3" points="100" />

          <Card className="text-center" style={{ marginTop: '10px' }}>
            <Card.Body>
              <Card.Title>Your rank: 123</Card.Title>
            </Card.Body>
          </Card>

        </Col>
        <Col>

          <Card style={{ height: '100%' }}>
            <Card.Body>
              <Card.Text>Name</Card.Text>
            </Card.Body>
          </Card>

        </Col>
      </Row>
    );
  }

}

/*class Bar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '',
      height: '',
      shift: ''
    }
  }

  render() {
    return (
      <Container>
        <Card className="text-center" style={{ height: '50px', marginTop: this.state.shift, marginBottom: '5px' }}>
          <Card.Header>
            <Card.Title>Name</Card.Title>
          </Card.Header>
        </Card>
        <Card className="text-center" bg={this.state.color} style={{ height: this.state.height }}>
          <Card.Body>
            <Card.Text>test</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  componentDidMount() {
    switch (this.props.rank) {
      case '1':
        this.setState({
          color: 'primary',
          height: '200px'
        })
        break;

      case '2':
        this.setState({
          color: 'danger',
          height: '150px',
          shift: '50px'
        })
        break;

      case '3':
        this.setState({
          color: 'warning',
          height: '100px',
          shift: '100px'
        })
        break;
    }
  }
}*/

class Tier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tier: '',
      tierText: '',
      points: '',
      color: ''
    }
  }

  render() {
    return (
      <div style={{ marginBottom: '10px' }}>
        <div class="card-stats card">
          <div class="card-body">
            <div class="row">
              <div class="col">
                <h5 class="text-uppercase text-muted mb-0 card-title">{this.state.tierText}</h5>
                <span class="h5 font-weight-bold mb-0">{this.state.points} Points</span>
              </div>
              <div class="col-auto col">
                <IconContext.Provider value={{ color: this.state.color, size: '35px' }}>
                  <div>
                    <RiVipCrownFill />
                  </div>
                </IconContext.Provider>
              </div>
            </div>
            <p class="mt-3 mb-0 text-muted text-sm">
              <span class="text-success mr-2">3.48%</span>
              <span class="text-nowrap">Since last month</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    switch (this.props.tier) {
      case '1':
        this.setState({
          tier: '1',
          tierText: '1st place',
          points: this.props.points,
          color: 'gold'
        })
        break;
      case '2':
        this.setState({
          tier: '2',
          tierText: '2nd place',
          points: this.props.points,
          color: 'silver'
        })
        break;
      case '3':
        this.setState({
          tier: '3',
          tierText: '3rd place',
          points: this.props.points,
          color: '#B87333'
        })
        break;
    }
  }
}

export default Ranking;