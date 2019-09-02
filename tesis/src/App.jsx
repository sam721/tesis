// @flow
import React from 'react';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

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

import Footer from './Components/Footer';
import MenuBar from './Components/MenuBar';
const mapStateToProps = state => ({
  algorithm: state.algorithm,
})

class App extends React.Component {
  
  render() {
    return (
      <body>
        <div>
          <Container fluid={true}>
            <ReactNotification/>
            <CodeBlock/>
            <MenuBar/>
            <Row>
              <Col>
                <Editor algorithm={this.props.algorithm} />
              </Col>
              {/*
                <Col xs={3}>
                  <AlgorithmInfo algorithm={this.props.algorithm} />
                </Col>
              */}
            </Row>
            <Footer/>
          </Container>
        </div>
      </body>
    );
  }
  
}

export default connect(mapStateToProps)(App);
