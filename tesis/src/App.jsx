// @flow
import React from 'react';
import './views/css/App.css';
import './views/css/codeblock.css';
import { Container, Row, Col } from 'react-bootstrap';
import AlgorithmInfo from './Components/AlgorithmInfo'
import Editor from './Editor';
import Sidebar from './Components/Sidebar';
import CodeBlock from './Components/CodeBlock';
import { connect } from 'react-redux';
import BFS from './resources/pseudocodes/BFS';
import BFS_table from './resources/value_tables/BFS_table';

const mapStateToProps = state => ({
  algorithm: state.algorithm,
})

class App extends React.Component {
  /*
  render() {
    const props = {
      color: ['Gris', 'Blanco', 'Gris', 'Negro', 'Gris'],
      u: 0,
      v: 3,
      inicio: 1,
    }
    return (
      <body>
        <BFS_table props={props}/>
      </body>
    );
  }
  */
  
  render() {
    return (
      <body>
        <div style={{display: 'table', width: '100%'}}>
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
        </div>
      </body>
    );
  }
}

export default connect(mapStateToProps)(App);
