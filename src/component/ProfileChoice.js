import React from 'react';
import server from 'socket.io-client';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const avatarChoices = [
    'https://ih1.redbubble.net/image.1573052278.8041/st,small,507x507-pad,600x600,f8f8f8.u1.jpg',
    'https://ih1.redbubble.net/image.1652945041.9401/st,small,507x507-pad,600x600,f8f8f8.jpg',
    'https://i.pinimg.com/originals/7f/7c/1d/7f7c1dd0e47c39c330137a7258ae4bec.png',
    'https://ih1.redbubble.net/image.1667529454.4344/st,small,507x507-pad,600x600,f8f8f8.jpg',
    'https://ih1.redbubble.net/image.1652885213.4662/st,small,507x507-pad,600x600,f8f8f8.jpg',
    'https://ih1.redbubble.net/image.1576587976.3410/st,small,507x507-pad,600x600,f8f8f8.u1.jpg',
    'https://ih1.redbubble.net/image.1573068447.8364/st,small,507x507-pad,600x600,f8f8f8.u1.jpg',
    'https://ih1.redbubble.net/image.1573043479.7857/st,small,507x507-pad,600x600,f8f8f8.u1.jpg'
];

let row1 = avatarChoices.slice(0, 4);
let row2 = avatarChoices.slice(4, 8);

class ProfileChoice extends React.Component {
    render() {
        return (
            <div class="text-center">
                <Row>
                    {row1.map((pic) => {
                        return (
                            <Col>
                                <input type='radio' name='profile' value={pic} onChange={e => this.props.currentPic(e.target.value)} />
                                <img alt="" src={pic} width="75px" height="75px"></img>
                            </Col>
                        );
                    })}
                </Row>
                <Row>
                    {row2.map((pic) => {
                        return (
                            <Col>
                                <input type='radio' name='profile' value={pic} onChange={e => this.props.currentPic(e.target.value)} />
                                <img alt="" src={pic} width="75px" height="75px"></img>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        );
    }
}

export default ProfileChoice;