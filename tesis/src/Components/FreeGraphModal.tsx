import React from 'react';
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';
import actions from '../Actions/actions';
import FreeGraph from './FreeGraph';
const { connect } = require('react-redux');
type Props = {
  showTutorialModal: boolean,
  dispatch: (action: Object) => Object,
}

const mapStateToProps = (state:Props) => {
  return {...state};
}
class FreeGraphModal extends React.Component<Props>{
  render(){
    const handleClose = () => this.props.dispatch({ type: actions.TOGGLE_TUTORIAL_MODAL});
    return (
      <>
        <Modal size="lg" show={this.props.showTutorialModal} onHide={handleClose}>
          <Modal.Header className='modal-header' closeButton>
            <Modal.Title>Dibujo de grafos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='tutorial-paragraph'>Para crear un nodo, debe dar <b>click</b> en un espacio en blanco</p>
            <p className='tutorial-paragraph'>Seleccione nodos o aristas simplemente dando click sobre estos</p>
            <p className='tutorial-paragraph'>Para crear una arista, seleccione un nodo <b>fuente</b> y luego seleccione un nodo <b>destino</b></p>
            <FreeGraph/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleClose}>
              ¡Entendido!
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps)(FreeGraphModal);