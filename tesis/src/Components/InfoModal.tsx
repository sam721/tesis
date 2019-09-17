import React, {FunctionComponent} from 'react';
import BFSWiki from '../resources/information/BFS';
import { Modal, Button } from 'react-bootstrap';

type Props = {
  show: boolean,
  close: () => void,
  article: JSX.Element | null,
}
class InfoModal extends React.Component<Props>{
  render(){
    return (
      <Modal size='lg' show={this.props.show} onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>
            Informacion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.article}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.props.close}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default InfoModal;