import { Row, Col } from 'react-bootstrap';
import React from 'react';
import actions from '../Actions/actions'
const { connect } = require('react-redux');

type Props = {
  dispatch: (action: Object) => Object,
  speed: number,
}

const mapStateToProps = (state: Props) => {
  return {
    speed: state.speed,
  }
}

const SpeedBar = (props: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatch({
      type: actions.CHANGE_SPEED,
      payload: {
        speed: e.currentTarget.value,
      }
    })
  }
  return (
    <Row>
      <Col xs={12}>
        <input
          type="range"
          min="0.05"
          max="5"
          value={props.speed}
          id="myRange"
          step="0.05"
          onChange={handleChange}>
        </input>
      </Col>
    </Row>
  )
}

export default connect(mapStateToProps)(SpeedBar);