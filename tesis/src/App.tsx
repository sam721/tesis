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
type Props = {
  algorithm: string, show: boolean 
} 
type State = {
  isMobile: boolean,
}
class App extends React.Component<Props, State>{
  constructor(props: Props){
    super(props);
    this.state = { isMobile: window.innerWidth <= 800}
  }

  handleWindowResize = () => {
    this.setState({isMobile: window.innerWidth <= 800});
  }

  componentWillMount(){
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleWindowResize);
  }

  render() {
    const {isMobile} = this.state;
    if(isMobile){
      return (
        <Container>
          <Row>
            <Col>
              <div className="mobile home-title">
                <p>¡Ups! :(</p>
                <p>Esta aplicación esta pensada para ser visualizada en dispositivos de mayor resolución</p>
              </div>
            </Col>
          </Row>
        </Container>
      );
    }
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
