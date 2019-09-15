import React from 'react';
import actions from '../Actions/actions';
const { connect } = require('react-redux');

type Props = {
  dispatch: (action:Object) => void,
}
class Home extends React.Component<Props> {
  componentDidMount(){
    this.props.dispatch({
      type: actions.HOME,
    });
  }

  render(){
    console.log('EPA');
    return <></>
  }
}

export default connect()(Home);