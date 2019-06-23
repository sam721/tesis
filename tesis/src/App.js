// @flow
import React from 'react';
import './App.css';
import {Container, Row, Col} from 'react-bootstrap';
import Editor from './Editor';
import Sidebar from './Components/Sidebar';

import {connect} from 'react-redux';


const mapStateToProps = state => ({
  algorithm: state.algorithm,
})

class App extends React.Component {
  render(){
    return (
      <Container fluid={true}>
        <Row>
          <Col md={2} className='sidebar'>
            <Sidebar/>
          </Col>
          <Col>
            <Editor algorithm={this.props.algorithm}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(App);
