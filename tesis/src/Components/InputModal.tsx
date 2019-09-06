import React, { ReactElement } from 'react';
import Modal from 'react-bootstrap/Modal'
import { Button, FormControl } from 'react-bootstrap';
import actions from '../Actions/actions';

const { connect } = require('react-redux');
//5(3(1(.)(.))(4(.)(.)))(9(7(6(.)(.))(8(.)(.)))(15(11(.)(.))(.)))
type Props = {
  show: boolean,
  handleClose: () => void,
  callback: (value: number) => void,
  currentValue: number,
  dispatch: (action:Object) => void,
}

type storeState = {
  selection: {weight: number},
}

type State = {
  text: string,
}

const mapStateToProps = (state:storeState) => {
  return {
    currentValue: (state.selection ? state.selection.weight : 0),
  }
}
class InputModal extends React.Component<Props, State>{
  input:HTMLInputElement | null;
  setStepInputRef:(element:HTMLInputElement)=>void;

  constructor(props:Props){
    super(props);
    this.input = null;
    this.state = {
      text: this.props.currentValue.toString(),
    }
    this.setStepInputRef = element => {
      this.input = element;
    };
  }

  componentDidUpdate(prevProps:Props){
    const {currentValue} = this.props;
    if(currentValue != null && currentValue != prevProps.currentValue){
      this.setState({
        text: this.props.currentValue.toString(),
      })
    }
  }

  validateNumber(text: string) {
    let regex = /^([-]?([0-9]{1,3}))$/;
    if (text && regex.test(text)) {
      return true;
    } else {
      this.props.dispatch({
        type: actions.INVALID_INTEGER_ERROR,
      })
      return false;
    }
  }

  handleAccept = () => {
    if(this.input && this.validateNumber(this.input.value)){
      const text = this.input.value;
      const value = parseInt(text);
      this.props.callback(value);
      this.props.handleClose();
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({text: e.currentTarget.value});
  }

  handleCancel = () => {
    if(this.props.currentValue) this.setState({text: this.props.currentValue.toString()});
    this.props.handleClose();
  }
  render(){
    const {show, handleClose} = this.props;
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className='modal-header' closeButton>
          <Modal.Title>Introduzca un numero entero</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>El numero debe estar entre -999 y 999</p>
          <input 
            id="IntInput"
            type="number" 
            min={-999}
            max={999}
            ref={this.setStepInputRef} 
            value={this.state.text}
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

export default connect(mapStateToProps)(InputModal);