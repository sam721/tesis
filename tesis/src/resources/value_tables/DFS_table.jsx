import {Row, Col, Container} from 'react-bootstrap';
import React from 'react';
const DFS_table = values => {
  return (
      <Row style={{borderColor: 'black', borderStyle: 'solid'}} className='values-table'>
        <Col xs={1}>a</Col>
        <Col xs={1}>a</Col>
        <Col xs={1}>a</Col>
        <Col xs={1}>a</Col>
        <Col xs={1}>a</Col>
        <Col xs={1}>a</Col>
        <Col xs={1}>a</Col>
        <Col xs={1}>a</Col>
        <Col xs={1}>a</Col>
        <Col xs={1}>a</Col>
        <Col xs={1}>a</Col>
        <Col xs={1}>a</Col>
      </Row>
  )
  /*
  return (
    <Container fluid={true}>
      <Row className='values-table'>
        <Col xs={1}>LLamada</Col>
        <Col xs={11}>{values.func}(G, {values.inicio})</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>Color</Col>
        <Col xs={11}>{values.color.toString()}</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>u</Col>
        <Col xs={1}>{values.u}</Col>
        <Col xs={1}>Color[u]</Col>
        <Col xs={9}>{values.color[values.u]}</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>v</Col>
        <Col xs={1}>{values.v}</Col>
        <Col xs={1}>Color[v]</Col>
        <Col xs={9}>{values.color[values.v]}</Col>
      </Row>
    </Container>
  )
  */
}

export default DFS_table;