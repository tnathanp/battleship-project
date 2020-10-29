import React from 'react';
import server from 'socket.io-client';
import { Row, Col, Container, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

class Game extends React.Component {

    render() {
        return (
            <Container style={{ paddingTop: '2%' }}>
                <Row>
                    <Col>
                        <Card style={{ backgroundColor: '#e9ecef', borderRadius: '0 0 10px 10px' }}>
                            <Card.Body>
                                หวัดดีคร้าบบบบบบ
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    componentDidMount() {
        let timerInterval
        Swal.fire({
            title: 'Time remaining',
            html: '<a></a>',
            timer: 10000,
            timerProgressBar: true,
            backdrop: false,
            willOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                    const content = Swal.getContent()
                    if (content) {
                        const t = content.querySelector('a')
                        if (t) {
                            t.textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                        }
                    }
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
            }
        })
    }
}

export default Game;