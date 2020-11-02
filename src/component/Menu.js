import React from 'react';
import socket from '../connection';
import Swal from 'sweetalert2';
import { Navbar, NavDropdown, Nav, Button, Modal, Card, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiShoppingCart2Fill, RiShipLine } from 'react-icons/ri';
import { AiFillTrophy } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { HiHome } from 'react-icons/hi';
import { MdExitToApp } from 'react-icons/md';
import { BiGlasses } from 'react-icons/bi'
import { IoIosRocket} from 'react-icons/io'
import './Menu.css';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: {
                lobby: false,
                shop: false,
                rank: false
            },
            currentProfilePic: '',
            showDropDown: false,
            showProfileSetting: false
        }
    }

    navigate(dest) {
        this.setState({
            redirect: {
                lobby: dest === 'lobby',
                shop: dest === 'shop',
                rank: dest === 'rank'
            }
        })
    }

    handleDropDown() {
        if (this.state.showProfileSetting === true) {
            return false
        }

        socket.emit('req profile pic', localStorage.getItem('auth'));

        this.setState({ showDropDown: !this.state.showDropDown })
    }

    showProfileSetting() {
        this.setState({ showProfileSetting: !this.state.showProfileSetting });
    }

    changeProfile() {
        //socket emit change profile
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
        socket.on('res profile pic', url => {
            this.setState({
                currentProfilePic: url
            })
        })
    }

    render() {

        const modalProfileSetting = (
            <Modal centered size="sm" show="true" backdrop="static">
                <Modal.Header><Modal.Title>Your profile</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Row className="justify-content-md-center">
                        <Card style={{ width: '15rem' }}>
                            <Card.Img variant="top" src={this.state.currentProfilePic} />
                            <Card.Body>
                            <Row className="justify-content-md-center">
                                <Card.Title>ชื่อ...</Card.Title> </Row>
                            <Row className="justify-content-md-center">
                                <Card.Text><IoIosRocket/>+จน.     <BiGlasses/>+จน.</Card.Text> </Row>
                            </Card.Body>
                        </Card>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                <Row className="justify-content-md-center">
                    <Button variant="primary">Change picture</Button>   
                     </Row>  
                  
                    <Button variant="secondary" onClick={() => this.showProfileSetting()}>Close</Button>
                </Modal.Footer>
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
                            <NavDropdown.Item onClick={() => this.hello()}>Background</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => this.hello()}>Song</NavDropdown.Item>
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
