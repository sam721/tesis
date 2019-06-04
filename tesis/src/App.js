// @flow
import React from 'react';
import logo from './logo.svg';
import './App.css';
import cytoscape from 'cytoscape';
import Canvas from './Canvas';
class App extends React.Component {
  render(){
    return (
      <div>
        <h1>Edicion de grafos</h1>
        <p>Click en el canvas para insertar nodos</p>
        <p>Click sobre elementos para seleccionarlos</p>
        <p>Para conectar nodos, primero seleccionar el origen y luego el destino</p>
        <br/>
        <Canvas/>
      </div>

    )
  }
}

export default App;
