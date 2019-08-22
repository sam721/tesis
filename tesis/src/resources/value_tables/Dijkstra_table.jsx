import {Row, Col, Container} from 'react-bootstrap';
import React from 'react';
const Dijkstra_table = props => {
  const {values} = props;
  return (
    <Container>
      <Row className='values-table'>
        <Col xs={1}>LLamada</Col>
        <Col xs={11}>Dijkstra(G, {values.inicio})</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>distancia</Col>
        <Col xs={11}>{values.dist.toString()}</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>cola</Col>
        <Col xs={11}>{values.cola.toString()}</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>u</Col>
        <Col xs={1}>{values.u}</Col>
        <Col xs={1}>distancia[u]</Col>
        <Col xs={9}>{values.dist[values.u]}</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>v</Col>
        <Col xs={1}>{values.v}</Col>
        <Col xs={1}>Color[v]</Col>
        <Col xs={9}>{values.dist[values.v]}</Col>
      </Row>
    </Container>
  )
}

export default Dijkstra_table;