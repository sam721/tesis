import {Row, Col} from 'react-bootstrap';
import React from 'react';
import OptionsMenu from './OptionsMenu';
import SpeedBar from './SpeedBar';
const { connect } = require('react-redux');

type Props = {
  run: () => void,
  options: Array<{name: string, run: () => void}>
}

const mapStateToProps = (state:Props) => {
  return {
    run: state.run,
    options: state.options,
  }
}

class Footer extends React.Component<Props>{
  render(){
    return(
      <div className='footer'>
        <Row>
          <Col md={2}>
            <div className="dropup">
              <button className='dropdown-button'>Acciones</button>
              <div className='actions-menu'>
                <OptionsMenu op={this.props.options}/>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <button className='dropdown-button' onClick={this.props.run}>Reproducir</button>
          </Col>
          <Col>
            <SpeedBar/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Footer);