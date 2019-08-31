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
}

type storeState = {
  selection: {weight: number},
}

type State = {
  text: string,
}

const mapStateToProps = (state:storeState) => {
  console.log(state.selection);
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
      console.error('No number');
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
    this.setState({text: this.props.currentValue.toString()});
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
          <input 
            type="text" 
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