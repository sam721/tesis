import React from 'react';
import { Row, Col } from 'react-bootstrap';
import actions from '../Actions/actions';

const {connect} = require('react-redux');

type Props = {
  callback: () => void,
  algorithm: string,
  dispatch: (action: Object) => Object,
  timeEllapsed: number,
  processing: boolean,
};

type storeState = {
  gifLength: number,
  processingGif: boolean,
}

const mapStateToProps = (state: storeState) => {
  return {
    timeEllapsed: state.gifLength,
    processing: state.processingGif,
  }
}

class  GIFControl extends React.Component<Props>{
  handleClick(){
    this.props.callback();
  }
  render(){
    console.log(this.props.processing);
    const {timeEllapsed} = this.props;
    let ss = Math.floor(timeEllapsed/10).toString();
    let ms = (timeEllapsed%10).toString();
    if(ss.length === 1) ss = '0'+ss;
    return (
      <button className='dropdown-button' disabled={this.props.processing} onClick={() => this.handleClick()}>
        {this.props.processing ? 'Procesando...' : 'GIF' + (this.props.timeEllapsed ? ' 0:' + ss + ':' +  ms : '')}
      </button>
    )
  }
};

export default connect(mapStateToProps)(GIFControl);