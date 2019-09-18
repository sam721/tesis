import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faTimes, faPlayCircle, faStopCircle } from '@fortawesome/free-solid-svg-icons'
import actions from '../Actions/actions'

import SpeedBar from './SpeedBar'
const { connect } = require('react-redux');

type Props = {
  dispatch: (action: Object) => Object,
  algorithm: string,
  animation: Boolean,
  selection: any,
  weighted: boolean,
  run: () => void,
  remove: () => void,
  clearGraph: () => void,
  changeWeight: (weight: number) => void,
  speed: number,
}

type State = {
  algorithm: string,
  animation: Boolean,
  selection: Object,
  weight: string,
  speed: number,
}

const mapStateToProps = (state: State) => {
  return ({
    algorithm: state.algorithm,
    selection: state.selection,
    animation: state.animation,
    speed: state.speed,
  })
}
class ControlBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      algorithm: '',
      selection: {},
      weight: '',
      animation: false,
      speed: 0,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.selection && this.props.selection.type === 'edge') {
      if (!prevProps.selection || prevProps.selection.id !== this.props.selection.id) {
        this.setState({ weight: this.props.selection.weight });
      }
    }
  }
  validateWeight(weight: string) {
    let regex = /^[0-9]*/;
    if (weight && regex.test(weight)) {
      this.props.changeWeight(parseInt(weight, 10));
    } else {
      console.error('No number');
    }
  }
  handleWeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ weight: e.currentTarget.value });
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch({
      type: actions.CHANGE_SPEED,
      payload: {
        speed: e.target.value,
      }
    })
  }
  render() {
    let { selection } = this.props;
    let edgeWeightInput = null;
    if (selection && selection.type === 'edge' && this.props.weighted) {
      edgeWeightInput = (
        <Row>
          <Col xs={6}>
            <input
              type="number"
              min="0"
              placeholder="peso"
              value={this.state.weight}
              style={{ width: '100%' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleWeightChange(e)} />
          </Col>
          <Col xs={6}>
            <button onClick={() => this.validateWeight(this.state.weight)}>Cambiar</button>
          </Col>
        </Row>
      )
    }
    return (
      <Container fluid={true} className='ControlBar'>
        <Row className='vertical-align'>
          <Col xs={1} >
            <button onClick={this.props.clearGraph} title="Limpiar grafo">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </Col>
          <Col xs={1} >
            <button onClick={this.props.remove} title="Eliminar elemento">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </Col>
          <Col xs={6} style={{ textAlign: 'center' }}>
            <button onClick={this.props.run} title="Reproducir">
              <FontAwesomeIcon icon={(this.props.animation ? faStopCircle : faPlayCircle)} />
            </button>
          </Col>
          <Col xs={2}> {edgeWeightInput}</Col>
          <Col xs={2}>
            <SpeedBar/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(ControlBar);
