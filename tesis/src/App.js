// @flow
import React from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import AlgorithmInfo from './Components/AlgorithmInfo'
import Editor from './Editor';
import Sidebar from './Components/Sidebar';

import { connect } from 'react-redux';


const mapStateToProps = state => ({
  algorithm: state.algorithm,
})

class App extends React.Component {
  render() {
    return (
      <body>
        <Container fluid={true}>
          <Row>
            <Col xs={2} className='sidebar'>
              <Sidebar />
            </Col>
            <Col xs={7}>
              <Editor algorithm={this.props.algorithm} />
            </Col>
            <Col xs={3}>
              <AlgorithmInfo algorithm={this.props.algorithm} />
            </Col>
          </Row>
        </Container>
      </body>
    );
  }
}

export default connect(mapStateToProps)(App);
