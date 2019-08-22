import React, { ReactElement } from 'react';

const { connect } = require('react-redux');

type Props = {
  code: Array<{text: string, ind: number}>,
  current: number,
}

type State = {
  pseudo: Array<{text: string, ind: number}> | null,
  line: number,
}
const mapStateToProps = (state: State) => {
  return {
    code: state.pseudo,
    current: state.line,
  }
}
const CodeLine = (props:{line:{text:string, ind: number}, current: boolean}) => {
  const {line, current} = props;
  return <span style={{backgroundColor: (current ? 'lightgray' : 'white'), display: 'block', paddingLeft: (line.ind *5).toString() + '%'}}>{line.text}</span>
}

class CodeBlock extends React.Component<Props>{
  render(){
    const {code, current} = this.props;
    let lines = [];
    if(code){
      for(let i = 0; i < code.length; i++){
        lines.push(<CodeLine line = {code[i]} current = {i === current}/>);
      }
    }
    return (
      <div className='codeblock'>
        {lines}
      </div>
    );
  }
}

export default connect(mapStateToProps)(CodeBlock);