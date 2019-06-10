// @flow
import React from 'react';
import './App.css';
import Editor from './Editor';

class App extends React.Component {
  render(){
    return (
      <div>
        <h1>Edicion de grafos</h1>
        <p>Click en el canvas para insertar nodos</p>
        <p>Click sobre elementos para seleccionarlos</p>
        <p>Para conectar nodos, primero seleccionar el origen y luego el destino</p>
        <br/>
        <Editor/>
      </div>


    )
  }
}

export default App;
