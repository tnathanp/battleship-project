import React from 'react';
import socket from '../connection';
import { Row, Col, Card, Container, ListGroup, ListGroupItem } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IconContext } from 'react-icons';
import { RiVipCrownFill } from 'react-icons/ri';
import { FaUserAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    socket.emit('request rank data', localStorage.getItem('auth'));

    socket.on('response rank data', data => {
      this.setState({
        data: data,
        isLoaded: true
      })
    })
  }


  render() {
    let result;
    if (this.state.isLoaded === false) {
      Swal.fire({
        title: 'Loading',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading()
        }
      })
    } else {
      let rank = 0;
      let points = 0;
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].isMe === true) {
          rank = this.state.data[i].rank
          points = this.state.data[i].points
        }
      }
      let a = [];
      for (let i = 3; i < this.state.data.length; i++) {
        a.splice(i - 3, 0, this.state.data[i]);
      }
      Swal.close();
      result = (
        <Row>
          <Col>

            <Tier tier="1" points={this.state.data[0].points} name={this.state.data[0].name} />
            <Tier tier="2" points={this.state.data[1].points} name={this.state.data[1].name} />
            <Tier tier="3" points={this.state.data[2].points} name={this.state.data[2].name} />

            <Card className="text-center" style={{ marginTop: '10px' }}>
              <Card.Body>
                <Row>
                  <Col>
                    Your points
                    <Card.Text style={{ fontSize: '25px' }}>{points}</Card.Text>
                  </Col>
                  <Col>
                    Your rank
                    <Card.Text style={{ fontSize: '25px' }}>{rank}</Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

          </Col>
          <Col>

            <Card style={{ height: '100%' }}>
              <Card.Body>
                <Card.Text>
                  <ListGroup>
                    {
                      a.map((item, i) => {
                        return (
                          <ListGroup.Item key={i}>
                            <Row>
                              <Col>
                                <h6 class="text-uppercase text-muted mb-0 card-title">Rank: {item.rank}</h6>
                                <h6 >{item.name}</h6>
                              </Col>
                              <Col>
                                <h6 style={{ marginTop: '20px' }}>{item.points} Points</h6>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        )
                      })
                    }
                  </ListGroup>
                </Card.Text>
              </Card.Body>
            </Card>

          </Col>
        </Row>
      );
    }

    return (
      <Container>
        {result}
      </Container>
    );
  }

}

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
                <span class="h5 font-weight-bold mb-0">{this.props.name}</span>
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
              <span class="text-success mr-2">{this.props.points} Points</span>
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