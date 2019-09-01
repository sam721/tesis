import React from 'react';
import { Row, Col } from 'react-bootstrap';

const {connect} = require('react-redux');

type Props = {
  callback: () => void,
  algorithm: string,
};

type State = {
  counter: number;
  recording: boolean;
}

type storeState = {
  algorithm: string,
}

const mapStateToProps = (state: storeState) => {
  return {
    algorithm: state.algorithm,
  }
}

class  GIFControl extends React.Component<Props, State>{
  interval=0;
  state = {
    counter: 0,
    recording: false,
  };

  componentDidUpdate(prevProps:Props){
    if(prevProps.algorithm !== this.props.algorithm){
      clearInterval(this.interval);
      this.setState({counter: 0, recording: false});
    }
  }

  handleClick(){
    const {recording} = this.state;
    const setCounter = () => {
      const {counter} = this.state;
      if(counter === 60){
        clearInterval(this.interval);
        console.log('finished');
        this.setState({counter: 0, recording: false});
        this.props.callback();
      }else{
        this.setState({counter: counter+1});
      }
    }

    if(!recording){
      this.interval = window.setInterval(setCounter, 1000);
    }else{
      clearInterval(this.interval);
      this.setState({counter: 0, recording: false});
    }
    this.props.callback();
    this.setState({recording: !recording})
  }
  render(){
    let ss = this.state.counter.toString();
    if(ss.length === 1) ss = '0'+ss;
    return (
      <button className='dropdown-button' onClick={() => this.handleClick()}>GIF 0:{ss}</button>
    )
  }
};

export default connect(mapStateToProps)(GIFControl);