import React, { ReactElement } from 'react';
import Modal from 'react-bootstrap/Modal'
import { Button, FormControl } from 'react-bootstrap';
import {validateAVL} from '../utils/avl-utils';
import actions from '../Actions/actions';

const {connect} = require('react-redux');
type Props = {
  show: boolean,
  handleClose: (update?: boolean) => void,
  addNode: (id: string, value: number) => void,
  addEdge: (source: string, target: string) => void,
  clearGraph: () => void,
  dispatch: (action:Object) => void,
}
type State = {
  text: string,
}
class InputAVLModal extends React.Component<Props, State>{

  state = {
    text: '',
  }

  uploadGraph = () => {
    const input = (document.getElementById('AVLUploadInput') as HTMLInputElement);
    if(input.files){
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if(typeof reader.result === 'string'){
          const text = reader.result;
          this.validateArray(text);
        }
      }
      reader.readAsText(file);
    }
  }

  validateArray(text: string) {
    const {addNode, addEdge, clearGraph} = this.props;
    let regex = /^([^0-9().-]|([0-9]{4,})|([.]{2,}))/;
    if (text && regex.test(text)) {
      this.props.dispatch({type: actions.INVALID_AVL_ERROR})
      return false;
    } else {
      if(validateAVL(text, addNode, addEdge, clearGraph)) this.props.handleClose(true);
      else{
        this.props.dispatch({type: actions.INVALID_AVL_ERROR})
      }
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({text: e.currentTarget.value});
  }

  handleCancel = () => {
    this.props.handleClose();
  }
  render(){
    const {show, handleClose} = this.props;
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className='modal-header' closeButton>
          <Modal.Title>Seleccione un archivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>El archivo debe contener un arbol AVL valido, previamente descargado</p>
          <input type="file" id="AVLUploadInput"/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={this.uploadGraph}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connect()(InputAVLModal);