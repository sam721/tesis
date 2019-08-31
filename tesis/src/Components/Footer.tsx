import {Row, Col} from 'react-bootstrap';
import React from 'react';
import OptionsMenu from './OptionsMenu';
import SpeedBar from './SpeedBar';
const { connect } = require('react-redux');

type Props = {
  run: () => void,
  options: Array<{name: string, run: () => void}>
  photo: () => {},
  gif: () => {},
}

const mapStateToProps = (state:Props) => {
  return {
    run: state.run,
    options: state.options,
    photo: state.photo,
    gif: state.gif,
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
          <Col md={2}>
            <span>Velocidad</span>
            <SpeedBar/>
          </Col>
          <Col md={{span:1, offset:6}}>
            <button className='dropdown-button' onClick={this.props.photo}>Foto</button>
            </Col>
          <Col md={1}>
            <button className='dropdown-button' onClick={this.props.gif}>GIF</button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Footer);