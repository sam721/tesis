import React from 'react';
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';
import actions from '../Actions/actions';

const { connect } = require('react-redux');
type Props = {
  show: boolean,
  handleClose: () => void,
  dispatch: (action: Object) => Object,
}

class UploadGraphModal extends React.Component<Props>{

  uploadGraph = () => {
    const input = (document.getElementById('graphUploadInput') as HTMLInputElement);
    if(input.files){
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result;
        this.props.dispatch({
          type: actions.LOAD_GRAPH,
          payload: {
            data: content,
          }
        });
      }
      reader.readAsText(file);
      this.props.handleClose();
    }
  }
  render(){
    const {show, handleClose} = this.props;
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="file" id="graphUploadInput"/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => this.uploadGraph()}>
              Subir grafo
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default connect()(UploadGraphModal);