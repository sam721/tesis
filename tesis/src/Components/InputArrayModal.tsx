import React from 'react';
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';
import actions from '../Actions/actions';

const {connect} = require('react-redux');
type Props = {
  show: boolean,
  handleClose: () => void,
  changeArray: (values: Array<number>) => void,
  currentValues: Array<number>,
  dispatch: (action:Object)=>void,
}
type State = {
  text: string,
}
class InputArrayModal extends React.Component<Props, State>{
  input:HTMLInputElement | null;
  setStepInputRef:(element:HTMLInputElement)=>void;

  constructor(props:Props){
    super(props);
    this.input = null;
    this.state = {
      text: this.props.currentValues.toString(),
    }
    this.setStepInputRef = element => {
      this.input = element;
    };
  }

  validateArray(text: string) {
    let regex = /^(([-]?([0-9]{1,3})([,][ ]*)){0,15})([-]?([0-9]{1,3}))$/;
    if (text && regex.test(text)) {
      return true;
    } else {
      this.props.dispatch({type: actions.INVALID_ARRAY_ERROR})
      return false;
    }
  }

  handleAccept = () => {
    if(this.input && this.validateArray(this.input.value)){
      const text = this.input.value;
      const values = text.split(',').map(x => parseInt(x));
      this.props.changeArray(values);
      this.props.handleClose();
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({text: e.currentTarget.value});
  }

  handleCancel = () => {
    this.setState({text: this.props.currentValues.toString()});
    this.props.handleClose();
  }
  render(){
    const {show, handleClose} = this.props;
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className='modal-header' closeButton>
          <Modal.Title>Introduzca un arreglo de enteros</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Debe estar representado por maximo 16 numeros separados por coma</p>
          <p>Cada numero debe estar entre -999 y 999</p>
          <input 
            type="text" 
            ref={this.setStepInputRef} 
            value={this.state.text}
            size={60}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChange(e)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={this.handleAccept}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connect()(InputArrayModal);