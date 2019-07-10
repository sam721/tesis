import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';


const {connect} = require('react-redux');

const mapStateToProps = (state: any) => {
  return {
    algorithm: state.algorithm,
  }
}

class AlgorithmInfo extends React.Component<any>{
  render() {
    return (
      <Container style={{height: '100%', backgroundColor:'#ccc'}}>
        <Row style={{height: '40%'}}>
          <Col>
            <div className="algorithm-description">
              <div className="header">
                <h4>
                  {this.props.algorithm != null ? this.props.algorithm : 'Nombre del algoritmo'}
                </h4>
              </div>
              <div className="content">
                Descripcion del algoritmo
              </div>
            </div>
          </Col>
        </Row>
        <Row style={{height: '50%'}}>
          <Col>
            <div className="algorithm-description">
              <div className="header">
                <h4>Pseudocodigo</h4>
              </div>
              <div className="content">
                Descripcion del algoritmo
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(AlgorithmInfo);