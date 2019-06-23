import React from 'react';

const {connect} = require('react-redux');

type Props = {
  dispatch: (action: Object) => Object,
  algorithm: string,
  selection: Object,
  onClick: () => void,
}

type State = {
  algorithm: string,
  selection: Object,
}

const mapStateToProps = (state: State) => {
  return ({
    algorithm: state.algorithm,
    selection: state.selection,
  })
}

const ControlBar = (props: Props) => {
  return <button onClick = {props.onClick}>Click me!</button>
}

export default connect(mapStateToProps)(ControlBar);
