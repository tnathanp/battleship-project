import React from 'react';
import socket from '../connection';
import Swal from 'sweetalert2';
import { Navbar, NavDropdown, Nav, Button, Modal, Card, Row, Col, Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiShoppingCart2Fill, RiShipLine, RiAdminFill } from 'react-icons/ri';
import { AiFillTrophy } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { HiHome } from 'react-icons/hi';
import { MdExitToApp } from 'react-icons/md';
import { BiGlasses } from 'react-icons/bi';
import { IoIosRocket } from 'react-icons/io';
import ProfileChoice from './ProfileChoice';
import './Menu.css';

const backgroundChoices = [
    { color: 'Serenity & Rose quartz', code: 'linear-gradient(0deg, #f7cac9 0%, #b3cee5 100%)' },
    { color: 'Candy', code: 'linear-gradient(43deg, #4158D0 0%, #C850C0 51%, #FFCC70 100%)' },
    { color: 'Midnight', code: 'linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)' },
    { color: 'Nature', code: 'linear-gradient(132deg, #F4D03F 0%, #16A085 100%)' }
];

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.changeProfile = this.changeProfile.bind(this);
        this.state = {
            redirect: {
                lobby: false,
                shop: false,
                rank: false,
                admin: false
            },
            audio: [
                new Audio('/Pirates Of The Caribbean Theme Song.mp3'),
                new Audio('/Coffin Dance (Official Music Video HD).mp3'),
                new Audio('/Mii Channel Music.mp3')
            ],
            user: {
                name: '',
                profile: '',
                items: {
                    missile: 0,
                    glasses: 0
                }
            },
            isRefreshModal: false,
            showDropDown: false,
            showProfileSetting: false,
            showProfileChoice: false,
            showSongSetting: false,
            showBackgroundSetting: false
        }
    }

    navigate(dest) {
        this.setState({
            redirect: {
                lobby: dest === 'lobby',
                shop: dest === 'shop',
                rank: dest === 'rank',
                admin: dest === 'admin'
            }
        })
    }

    handleDropDown() {
        if (this.state.showProfileSetting === true ||
            this.state.showSongSetting === true ||
            this.state.showBackgroundSetting === true) {

            return false
        }

        socket.emit('request user data', localStorage.getItem('auth'));

        this.setState({ showDropDown: !this.state.showDropDown })
    }

    showProfileSetting() {
        this.setState({ showProfileSetting: !this.state.showProfileSetting });
    }

    showBackgroundSetting() {
        this.setState({ showBackgroundSetting: !this.state.showBackgroundSetting });
    }

    changeBackground(color) {
        document.body.style.backgroundImage = color;
    }

    showProfileChoice() {
        this.setState({ showProfileChoice: !this.state.showProfileChoice });
    }

    changeProfile(url) {
        this.setState({
            isRefreshModal: true
        })
        let data = {
            auth: localStorage.getItem('auth'),
            url: url
        }
        socket.emit('change profile', data);
        Swal.fire({
            title: 'Loading',
            showConfirmButton: false,
            allowOutsideClick: false,
            willOpen: () => {
                Swal.showLoading();
            }
        })
        this.showProfileChoice();
        this.showProfileSetting();
    }

    showSongSetting() {
        this.setState({ showSongSetting: !this.state.showSongSetting });
    }

    showBackgroundSetting() {
        this.setState({ showBackgroundSetting: !this.state.showBackgroundSetting });
    }

    changeBackground(color) {
        document.body.style.backgroundImage = color;
    }

    controlSong(n) {
        let aud = this.state.audio;
        for (let i = 0; i < aud.length; i++) {
            aud[i].pause();
            aud[i].currentTime = 0;
            if (i === n) {
                aud[i].play();
                aud[i].loop = true;
            }
        }
    }

    logout() {
        localStorage.removeItem('isLogin');
        localStorage.setItem('isLogin', false);
        socket.emit('offline', localStorage.getItem('auth'));
        localStorage.removeItem('auth');
        Swal.fire({
            title: 'Successfully logged out',
            icon: 'success',
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 1000
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                Swal.close();
                window.location.reload(false);
            }
        });
    }

    componentDidMount() {
        socket.on('response user data', data => {
            this.setState({
                user: {
                    name: data.user,
                    profile: data.profile,
                    items: {
                        missile: data.items.missile,
                        glasses: data.items.glasses
                    }
                }
            })
            if (this.state.isRefreshModal === true) {
                Swal.close();
                this.showProfileSetting();
                this.setState({ isRefreshModal: false });
            }
        })

        socket.on('success change profile', () => {
            socket.emit('request user data', localStorage.getItem('auth'));
        })

        socket.on('get kicked', () => {
            Swal.fire({
                title: 'Get kicked',
                text: 'You get kicked from the admin',
                timer: 2000,
                icon: 'warning',
                showConfirmButton: false,
                allowOutsideClick: false
            }).then(result => {
                Swal.close();
                this.logout();
            })
        })

    }

    render() {

        const modalProfileChoice = (
            <Modal centered size="lg" show="true" backdrop="static">
                <Modal.Header><Modal.Title>Choose Profile Picture</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Container><Row><Col><Card><Card.Header><Card.Body><Card.Text>
                        <ProfileChoice currentPic={this.changeProfile} />
                    </Card.Text></Card.Body></Card.Header></Card></Col></Row></Container>
                </Modal.Body>
            </Modal>
        );

        const modalProfileSetting = (
            <Modal centered size="sm" show="true" backdrop="static">
                <Modal.Header><Modal.Title>Your profile</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Row className="text-center">
                        <Card style={{ width: '15rem', marginLeft: 'auto', marginRight: 'auto' }}>
                            <Card.Img variant="top" src={this.state.user.profile} />
                            <Card.Body>
                                <Row className="justify-content-md-center">
                                    <Card.Title style={{ marginLeft: 'auto', marginRight: 'auto' }}>{this.state.user.name}</Card.Title>
                                </Row>
                                <Card>
                                    <Card.Header>
                                        <Row className="justify-content-md-center">
                                            <Card.Title style={{ marginLeft: 'auto', marginRight: 'auto' }}>Inventory</Card.Title>
                                        </Row>
                                        <Row className="justify-content-md-center">
                                            <Col>
                                                <IoIosRocket /> : {this.state.user.items.missile}
                                            </Col>
                                            <Col>
                                                <BiGlasses /> : {this.state.user.items.glasses}
                                            </Col>
                                        </Row>
                                    </Card.Header>
                                </Card>
                            </Card.Body>
                        </Card>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.showProfileChoice()}>Change picture</Button>
                    <Button variant="secondary" onClick={() => this.showProfileSetting()}>Close</Button>
                </Modal.Footer>
            </Modal>
        );

        const modalSongSetting = (
            <Modal centered size="sm" show="true" backdrop="static" onHide={() => this.showSongSetting()}>
                <Modal.Header closeButton><Modal.Title>Song Setting</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Container><Row><Col><Card><Card.Body><Card.Text>
                        <Button variant="light" onClick={() => this.controlSong(0)} block>Agressive</Button>
                        <Button variant="light" onClick={() => this.controlSong(1)} block>Dance</Button>
                        <Button variant="light" onClick={() => this.controlSong(2)} block>Chill</Button>
                        <Button variant="dark" onClick={() => this.controlSong(3)} block>Turn Off</Button>
                    </Card.Text></Card.Body></Card></Col></Row></Container>
                </Modal.Body>
            </Modal>
        );

        const modalBackgroundSetting = (
            <Modal centered size="sm" show="true" backdrop="static" onHide={() => this.showBackgroundSetting()}>
                <Modal.Header closeButton><Modal.Title>Background Setting</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Container><Row><Col><Card><Card.Body><Card.Text>
                        {backgroundChoices.map(backgroundChoice => {
                            return (
                                <Button block variant="info" onClick={() => this.changeBackground(backgroundChoice.code)}>
                                    {backgroundChoice.color}
                                </Button>
                            );
                        })}
                    </Card.Text></Card.Body></Card></Col></Row></Container>
                </Modal.Body>
            </Modal>
        );

        return (
            <Navbar bg="dark" variant="dark" expand="lg" style={{ borderRadius: '10px 10px 0 0' }}>
                <Navbar.Brand><RiShipLine />Eiei Battleship<RiShipLine /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link onClick={() => this.navigate('lobby')}>
                            {this.state.redirect.lobby && (<Redirect to='/' />)}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <HiHome style={{ marginRight: '5px' }} /> Lobby
                            </div>
                        </Nav.Link>
                        <Nav.Link onClick={() => this.navigate('shop')}>
                            {this.state.redirect.shop && (<Redirect to='/shop' />)}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <RiShoppingCart2Fill style={{ marginRight: '5px' }} />  Shop
                            </div>
                        </Nav.Link>
                        <Nav.Link onClick={() => this.navigate('rank')}>
                            {this.state.redirect.rank && (<Redirect to='/rank' />)}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <AiFillTrophy style={{ marginRight: '5px' }} />Rank
                            </div>
                        </Nav.Link>
                        <Nav.Link onClick={() => this.navigate('admin')}>
                            {this.state.redirect.admin && (<Redirect to='/admin' />)}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <RiAdminFill style={{ marginRight: '5px' }} />Admin
                            </div>
                        </Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        <NavDropdown
                            show={this.state.showDropDown}
                            onClick={() => this.handleDropDown()}
                            title={<div style={{ display: 'flex', alignItems: 'center' }}>
                                <FiSettings style={{ marginRight: '5px' }} />Settings
                                    </div>}
                            drop='left'
                        >
                            <NavDropdown.Item onClick={() => this.showProfileSetting()}>Profile</NavDropdown.Item>
                            {this.state.showProfileSetting && modalProfileSetting}
                            {this.state.showProfileChoice && modalProfileChoice}
                            <NavDropdown.Item onClick={() => this.showBackgroundSetting()}>Background</NavDropdown.Item>
                            {this.state.showBackgroundSetting && modalBackgroundSetting}
                            <NavDropdown.Item onClick={() => this.showSongSetting()}>Song</NavDropdown.Item>
                            {this.state.showSongSetting && modalSongSetting}
                            <NavDropdown.Item onClick={() => this.logout()}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <MdExitToApp style={{ marginRight: '5px' }} />Logout
                                </div>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Menu;
