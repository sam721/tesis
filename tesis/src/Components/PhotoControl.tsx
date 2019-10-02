import React from 'react';
import actions from '../Actions/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCamera,
}from '@fortawesome/free-solid-svg-icons'

const {connect} = require('react-redux');
type Props = {
  callback: () => void,
  dispatch: (action: Object) => void,
};

class PhotoControl extends React.Component<Props>{
  handleClick = () => {
    this.props.dispatch({
      type: actions.PHOTO_SUCCESS,
    });
    this.props.callback();
  }
  render(){
    return (
      <button title='Tomar foto' className='dropdown-button' onClick={this.handleClick}>
        <FontAwesomeIcon icon={faCamera} size="lg"/>
      </button>
    )
  }
}

export default connect()(PhotoControl);