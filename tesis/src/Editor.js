import React from 'react';
import Canvas from './Canvas';

class Editor extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <h1>Edicion de grafos</h1>
                <p>Click en el canvas para insertar nodos</p>
                <p>Click sobre elementos para seleccionarlos</p>
                <p>Para conectar nodos, primero seleccionar el origen y luego el destino</p>
                <br/>
                <div>
                    <Canvas algorithm={this.props.algorithm}/>
                </div>
            </div>
        )
    }
}

export default Editor;