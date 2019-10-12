import React from 'react';
import { Modal } from 'react-bootstrap';
import UCV from '../static/images/UCV.png';
import Ciencias from '../static/images/logo_ciencias.png';
import CytoLogo from '../static/images/logo_cytoscape.png';
const About = (props:{show:boolean, close:() => void}) => {
  return (
    <Modal size='lg' show={props.show} onHide={props.close}>
      <Modal.Header className='modal-header' closeButton>
        <Modal.Title>Acerca de CytoAyed</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: 'block', overflow: 'auto', paddingBottom: '30px'}}>
          <div style={{float: 'right', paddingLeft: '30px', paddingTop: '0px'}}>
            <img src={UCV} alt='ucv-logo' height='100px'/><br/>
            <img src={Ciencias} alt='ciencias-logo' height='100px'/>
          </div>
          <div style={{textAlign: 'justify'}}>
            <p>CytoAyed es desarrollado por Samuel Nacache, 
              estudiante de computación de la Facultad de Ciencias de la Universidad Central de Venezuela,
              como trabajo final para optar por el título de Licenciado en Computación</p>
            <p>Creado con el objetivo de ayudar tanto a nuevos estudiantes de computación, como a 
              interesados en las ciencias de la computación en general, CytoAyed ofrece visualizaciones 
              de diversos algoritmos, cubriendo principalmente el contenido temático de las asignaturas 
              de pregrado de la carrera de computación de la Facultad de Ciencias
            </p>
          </div>
        </div>
        <div style={{ display: 'block', overflow: 'auto', paddingBottom: '30px'}}>
          <div style={{float: 'left', paddingRight: '30px', paddingTop: '0px'}}>
            <img src={CytoLogo} alt='cytoscape-logo' width='200px'/>
          </div>
          <p>
            CytoAyed utiliza para la renderización de grafos y estructuras de datos abstractas
            la librería <i>Cytoscape.js</i>
          </p>
          <p>
            <i>Cytoscape.js: a graph theory library for visualisation and analysis</i>
          </p>
          <p>
            <i>Franz M, Lopes CT, Huck G, Dong Y, Sumer O, Bader GD</i>
          </p>
          <a href='https://academic.oup.com/bioinformatics/article/32/2/309/1744007'>https://academic.oup.com/bioinformatics/article/32/2/309/1744007</a>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default About;