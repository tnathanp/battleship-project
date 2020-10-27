import React from 'react';
import server from 'socket.io-client';
import Swal from 'sweetalert2';
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsJustify, BsTrophy } from "react-icons/bs";
import { RiShoppingCart2Fill, RiShipLine } from "react-icons/ri";
import { AiTwotoneHome } from "react-icons/ai";

class Menu extends React.Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark" size="lg" expand="lg">
                <Navbar.Brand href="#home"><RiShipLine />Eiei Battleship<RiShipLine /></Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link href="#home">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <AiTwotoneHome style={{ marginRight: '5px' }} /> Lobby
                            </div>
                        </Nav.Link>
                        <Nav.Link href="#link1">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <RiShoppingCart2Fill style={{ marginRight: '5px' }} />  Shop
                            </div>
                        </Nav.Link>
                        <Nav.Link href="#link2">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <BsTrophy style={{ marginRight: '5px' }} />Rank
                            </div>
                        </Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        <NavDropdown title={<BsJustify size={30} />} drop='left'>
                            <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Background</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Song</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Menu;
