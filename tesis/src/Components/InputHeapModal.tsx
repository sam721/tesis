import React, { ReactElement } from 'react';
import Modal from 'react-bootstrap/Modal'
import { Button, FormControl } from 'react-bootstrap';
import { validateHeap } from '../utils/heap-utils';

type Props = {
  show: boolean,
  changeArray: (values: Array<number>) => void;
  handleClose: () => void,
}
type State = {
  text: string,
}
class InputHeapModal extends React.Component<Props, State>{
  input:HTMLInputElement | null;
  setStepInputRef:(element:HTMLInputElement)=>void;

  constructor(props:Props){
    super(props);
    this.input = null;
    this.setStepInputRef = element => {
      this.input = element;
    };
  }

  uploadGraph = () => {
    const input = (document.getElementById('HeapUploadInput') as HTMLInputElement);
    if(input.files){
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        console.log(reader.result);
        if(typeof reader.result === 'string'){
          const text = reader.result;
          this.validateArray(text);
        }
      }
      reader.readAsText(file);
    }
  }

  validateArray(text: string) {
    let regex = /^(([-]?([0-9]{1,3})[,]){0,15})([-]?([0-9]{1,3}))$/;
    console.log(text);
    if (text && regex.test(text)) {
      const values = text.split(',').map(x => parseInt(x));
      console.log(values);
      if(validateHeap(values)){
        this.props.changeArray(values);
        this.props.handleClose();
      }
    } else {
      console.error('No number');
      return false;
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
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" id="HeapUploadInput"/>
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

export default InputHeapModal;