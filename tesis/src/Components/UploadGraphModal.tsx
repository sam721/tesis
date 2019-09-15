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
    if(input.files && input.files.length > 0){
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result;
        if(typeof content === 'string'){
          try{
            JSON.parse(content);
            this.props.dispatch({
              type: actions.LOAD_GRAPH,
              payload: {
                data: content,
              }
            });
          }catch(e){
            this.props.dispatch({type: actions.INVALID_GRAPH_ERROR});
          }
        }
      }
      reader.readAsText(file);
      this.props.handleClose();
    }else{
      this.props.dispatch({
        type: actions.NO_FILE_SELECTED_INFO,
      });
    }
  }
  render(){
    const {show, handleClose} = this.props;
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header className='modal-header' closeButton>
            <Modal.Title>Seleccione un archivo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>El archivo debe contener un grafo valido, previamente descargado </p>
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