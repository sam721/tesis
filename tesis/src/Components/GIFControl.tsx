import React from 'react';
import { Row, Col } from 'react-bootstrap';
import actions from '../Actions/actions';

const {connect} = require('react-redux');

type Props = {
  callback: () => void,
  algorithm: string,
  dispatch: (action: Object) => Object,
  timeEllapsed: number,
};

type storeState = {
  gifLength: number,
}

const mapStateToProps = (state: storeState) => {
  return {
    timeEllapsed: state.gifLength,
  }
}

class  GIFControl extends React.Component<Props>{
  handleClick(){
    this.props.callback();
  }
  render(){
    const {timeEllapsed} = this.props;
    let ss = Math.floor(timeEllapsed/10).toString();
    let ms = (timeEllapsed%10).toString();
    if(ss.length === 1) ss = '0'+ss;
    return (
      <button className='dropdown-button' onClick={() => this.handleClick()}>GIF 0:{ss}:{ms}</button>
    )
  }
};

export default connect(mapStateToProps)(GIFControl);