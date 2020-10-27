import React from 'react';
import server from 'socket.io-client';
import Swal from 'sweetalert2';
import { Modal, Button, Image, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class ProfileSetting extends React.Component {

    constructor() {
        super();
        this.state = {
            show: true,
            name: "",
            pic: ""
        }
    }

    handleAction() {
        this.setState({ show: !this.state.show })
    }

    setName(ค่าที่รับมา) {
        this.setState({ name: "" })
    }

    setPic(ค่าที่รับมา) {
        this.setState({ pic: "" })
    }

    render() {
        return (
            <div>
                <Modal centered size="lg" show={this.state.show}>
                    <Modal.Header>
                        <Modal.Title>Profile</Modal.Title>
                    </Modal.Header>
                    <Image src="holder.js/171x180" roundedCircle />
                    <Modal.Body>Name: {this.state.name}
                        <Card.Link> edit</Card.Link>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleAction()}>
                            Close
                    </Button>
                        <Button variant="primary" onClick={() => this.handleAction()}>
                            Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}

export default ProfileSetting;
