import React from 'react';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './views/css/App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Editor from './Editor';
import CodeBlock from './Components/CodeBlock';

import Footer from './Components/Footer';
import MenuBar from './Components/MenuBar';
import FreeGraphModal from './Components/FreeGraphModal';
class App extends React.Component<{ algorithm: string, show: boolean }>{
  render() {
    return (
      <div>
        <Container>
          <ReactNotification />
          <FreeGraphModal />
          <CodeBlock />
          <MenuBar />
          <Row>
            <Col>
              <Editor algorithm={this.props.algorithm} />
            </Col>
          </Row>
          <Footer />
        </Container>
      </div>
    );
  }

}

export default App;
