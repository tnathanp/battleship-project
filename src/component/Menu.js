import React from 'react';
import socket from '../connection';
import Swal from 'sweetalert2';
import { Navbar, NavDropdown, Nav, Button, Modal, Card, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiShoppingCart2Fill, RiShipLine } from 'react-icons/ri';
import { AiFillAlipaySquare, AiFillTrophy } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { HiHome } from 'react-icons/hi';
import { MdExitToApp } from 'react-icons/md';
import './Menu.css';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProfilePic: '',
            showDropDown: false,
            showProfileSetting: false
        }
    }

    showProfileSetting() {
        this.setState({ showProfileSetting: !this.state.showProfileSetting });
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

    handleDropDown() {
        if (this.state.showProfileSetting === true) {
            return false
        }

        socket.emit('req profile pic', localStorage.getItem('auth'));

        this.setState({ showDropDown: !this.state.showDropDown })
    }

    changeProfile() {
        //socket emit change profile
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
                                <Card.Title>ชื่อ...</Card.Title>
                                <Button variant="secondary">Edit</Button>
                            </Card.Body>
                        </Card>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.showProfileSetting()}>Close</Button>
                    <Button variant="primary">Save Changes</Button>
                </Modal.Footer>
            </Modal>

        );

        return (
            <Navbar bg="dark" variant="dark" expand="lg" style={{ borderRadius: '10px 10px 0 0' }}>
                <Navbar.Brand><RiShipLine />Eiei Battleship<RiShipLine /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link href="/">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <HiHome style={{ marginRight: '5px' }} /> Lobby
                            </div>
                        </Nav.Link>
                        <Nav.Link href="/shop">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <RiShoppingCart2Fill style={{ marginRight: '5px' }} />  Shop
                            </div>
                        </Nav.Link>
                        <Nav.Link href="/rank">
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
