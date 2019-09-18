import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import SpeedBar from './SpeedBar';
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
  insert: (value: number) => void,
}

type State = {
  algorithm: string,
  animation: Boolean,
  selection: Object,
  value: string,
}

const mapStateToProps = (state: State) => {
  return ({
    algorithm: state.algorithm,
    selection: state.selection,
    animation: state.animation,
  })
}


class TreeBar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      algorithm: '',
      selection: {},
      value: '',
      animation: false,
    }
  }

  validateValue(value: string) {
    let regex = /^-?[0-9]*/;
    if (value && regex.test(value)) {
      this.props.insert(parseInt(value, 10));
    } else {
      console.error('No number');
    }
  }

  handleValueChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({value: e.target.value});
  }

  render() {
    return (
      <Container fluid={true} className='ControlBar'>
        <Row className='vertical-align'>
          <Col xs={3}>
            <input
              type="number"
              placeholder="valor"
              value={this.state.value}
              style={{ width: '100%' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleValueChange(e)} />
          </Col> 
          <Col xs={3}>
            <button onClick={() => this.validateValue(this.state.value)}>
              Insertar
            </button>
          </Col>
          <Col xs={3}>
            <button onClick={() => this.props.remove()}>Eliminar</button>
          </Col>
          <Col xs={3}>
            <SpeedBar/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(TreeBar);
