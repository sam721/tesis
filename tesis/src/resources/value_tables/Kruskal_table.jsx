import {Row, Col, Container} from 'react-bootstrap';
import React from 'react';
const Kruskal_table = p => {
  const props = p.props;
  return (
    <Container>
      <Row className='values-table'>
        <Col xs={1}>LLamada</Col>
        <Col xs={11}>Kruskal(G)</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>F</Col>
        <Col xs={11}>{props.F}</Col>
      </Row>
      <Row className='values-table'>
        <Col xs={1}>(u,v)</Col>
        <Col xs={9}>({props.u},{props.v})</Col>
      </Row>
      <Row className='values_table'>
        <Col xs={1}>w</Col>
        <Col xs={9}>{props.w}</Col>
      </Row>
      <Row className='values_table'>
        <Col xs={1}>peso_total</Col>
        <Col xs={9}>{props.peso_total}</Col>
      </Row>
    </Container>
  )
}

export default Kruskal_table;