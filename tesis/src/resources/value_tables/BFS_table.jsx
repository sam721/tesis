import {Row, Col, Container} from 'react-bootstrap';
import React from 'react';
const BFS_table = p => {
  const props = p.props;
  return (
    <Container>
      <Row className='values-table'>
        <Col xs={1}>LLamada</Col>
        <Col xs={11}>BFS(G, {props.inicio})</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>Color</Col>
        <Col xs={11}>{props.color.toString()}</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>u</Col>
        <Col xs={1}>{props.u}</Col>
        <Col xs={1}>Color[u]</Col>
        <Col xs={9}>{props.color[props.u]}</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>v</Col>
        <Col xs={1}>{props.v}</Col>
        <Col xs={1}>Color[v]</Col>
        <Col xs={9}>{props.color[props.v]}</Col>
      </Row>
    </Container>
  )
}

export default BFS_table;