import {Row, Col, Container} from 'react-bootstrap';
import React from 'react';
const Prim_table = props => {
  const {values} = props;
  return (
    <Container>
      <Row className='values-table'>
        <Col xs={1}>LLamada</Col>
        <Col xs={11}>Prim(G)</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>distancia</Col>
        <Col xs={11}>{values.dist.toString()}</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>padre</Col>
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
        <Col xs={1}>{values.dist[values.u]}</Col>
        <Col xs={1}>padre[u]</Col>
        <Col xs={7}>{values.padre[values.u]}</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>v</Col>
        <Col xs={1}>{values.v}</Col>
        <Col xs={1}>distancia[v]</Col>
        <Col xs={1}>{values.dist[values.v]}</Col>
        <Col xs={1}>padre[v]</Col>
        <Col xs={7}>{values.padre[values.v]}</Col>
      </Row>
      <Row className='values_table'>
        <Col xs={1}>peso_total</Col>
        <Col xs={11}>{values.peso_total}</Col>
      </Row>
    </Container>
  )
}

export default Prim_table;