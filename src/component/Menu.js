import React from 'react';
import server from 'socket.io-client';
import Swal from 'sweetalert2';
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsJustify, BsTrophy } from "react-icons/bs";
import { RiShoppingCart2Fill, RiShipLine } from "react-icons/ri";
import { AiTwotoneHome } from "react-icons/ai";

class Menu extends React.Component {
    hello() {
        Swal.fire({
            icon: 'success',
            title: 'Hello',
            text: 'Test',
          })
    }

    render() {
        return (
            <Navbar bg="dark" variant="dark" style={{borderRadius: '10px 10px 0 0'}}>
                <Navbar.Brand><RiShipLine />Eiei Battleship<RiShipLine /></Navbar.Brand>
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link href="/">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <AiTwotoneHome style={{ marginRight: '5px' }} /> Lobby
                            </div>
                        </Nav.Link>
                        <Nav.Link href="/shop">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <RiShoppingCart2Fill style={{ marginRight: '5px' }} />  Shop
                            </div>
                        </Nav.Link>
                        <Nav.Link href="/rank">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <BsTrophy style={{ marginRight: '5px' }} />Rank
                            </div>
                        </Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        <NavDropdown title={<BsJustify size={30} />} drop='left'>
                            <NavDropdown.Item onClick={() => this.hello()}>Profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => this.hello()}>Background</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => this.hello()}>Song</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Menu;
