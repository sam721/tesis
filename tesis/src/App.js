// @flow
import React from 'react';
import './App.css';
import {Container, Row, Col} from 'react-bootstrap';
import Editor from './Editor';
import Sidebar from './Sidebar';
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      algorithm: 'none',
    }
  }
  render(){
    return (
      <Container fluid={true}>
        <Row>
          <Col md={2} className='sidebar'>
            <Sidebar/>
          </Col>
          <Col>
            <Editor algorithm={this.state.algorithm}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
