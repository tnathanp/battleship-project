import React from 'react';
import server from 'socket.io-client';
import {Row, Col, Button, Navbar} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const { useState } = require("react");

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

function ProfileChoice() {

    const [profile, setProfile] = useState('https://www.kindpng.com/picc/m/22-223965_no-profile-picture-icon-circle-member-icon-png.png');
  
    const ProfileChanged = (e) => {
        setProfile(e.currentTarget.value);
        console.log("changed ja "+profile);
    }

    let row1=avatarChoices.slice(0,4);
    let row2=avatarChoices.slice(4,8);

    return (
        <div class="text-center">
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="#home">
            {''}Choose Your Profile Picture
            </Navbar.Brand>
        </Navbar>
        <Row>
            {row1.map((pic) => {
                return(
                <Col>
                    <input type='radio' name='profile' value={pic} onChange={ProfileChanged}/>
                    <img src={pic} width="200" height="200"></img>
                </Col>
                );
            })}
        </Row>
        <Row>
            {row2.map((pic) => {
                return(
                <Col>
                    <input type='radio' name='profile' value={pic} onChange={ProfileChanged}/>
                    <img src={pic} width="200" height="200"></img>
                </Col>
                );
            })}
        </Row>
        <Row>
            <Col></Col>
            <Col><Button variant="info">Save</Button></Col>
            <Col></Col>
        </Row>
        </div>
      );  
    
}
export default ProfileChoice;