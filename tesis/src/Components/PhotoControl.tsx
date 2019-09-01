import React from 'react';
import actions from '../Actions/actions'
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
      <button className='dropdown-button' onClick={this.handleClick}>Foto</button>
    )
  }
}

export default connect()(PhotoControl);