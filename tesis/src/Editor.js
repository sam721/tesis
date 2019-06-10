import React from 'react';
import Canvas from './Canvas';

class Editor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            algorithm: "BFS",
        }
    }

    handleChange(event){
        this.setState({
            algorithm: event.target.value
        });
    }

    render(){
        return (
            <div>
                <Canvas algorithm={this.state.algorithm}/>
                <select value={this.state.algorithm} onChange={(e) => this.handleChange(e)}>
                    <option value = "BFS">BFS</option>
                    <option value = "DFS">DFS</option>
                </select>
            </div>
        )
    }
}

export default Editor;