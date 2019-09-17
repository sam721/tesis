// @flow
import React, { useState } from 'react';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import './views/css/App.css';

import { Container, Row, Col } from 'react-bootstrap';
import AlgorithmInfo from './Components/AlgorithmInfo'
import Editor from './Editor';
import Sidebar from './Components/Sidebar';
import CodeBlock from './Components/CodeBlock';
import BFS from './resources/pseudocodes/BFS';
import BFS_table from './resources/value_tables/BFS_table';
import BFSWiki from './resources/information/BFS'
import Footer from './Components/Footer';
import MenuBar from './Components/MenuBar';
import FreeGraphModal from './Components/FreeGraphModal';
import InfoModal from './Components/InfoModal';
class App extends React.Component<{algorithm:string, show:boolean}>{

  state = {
    show: true,
  }
  render() {
    const {show} = this.state;
    return (
      <body>
        <div>
          <Container>
            <ReactNotification/>
            <FreeGraphModal/>
            <CodeBlock/>
            <MenuBar/>
            <Row>
              <Col>
                <Editor algorithm={this.props.algorithm} />
              </Col>
            </Row>
            <Footer/>
          </Container>
        </div>
      </body>
    );
  }
  
}

export default App;
