import React from 'react';
import server from 'socket.io-client';
import Swal from 'sweetalert2';
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiShoppingCart2Fill, RiShipLine } from 'react-icons/ri';
import { AiFillTrophy } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { HiHome } from 'react-icons/hi';
import './Menu.css'

class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showDropDown: false
        }
    }

    hello() {
        Swal.fire({
            icon: 'success',
            title: 'Hello',
            text: 'Test',
        })
    }

    logout() {
        localStorage.removeItem('isLogin');
        localStorage.setItem('isLogin', false);
        window.location.reload(false);
    }
    
    handleDropDown() {
        this.setState({ showDropDown: !this.state.showDropDown})
    }

    render() {
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
                            <NavDropdown.Item onClick={() => this.hello()}>Profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => this.hello()}>Background</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => this.hello()}>Song</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => this.logout()}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Menu;
