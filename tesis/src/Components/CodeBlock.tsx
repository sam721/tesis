import React, { ReactElement } from 'react';

const { connect } = require('react-redux');

type Props = {
  code: Array<{text: string, ind: number}>,
  lines: Array<number>,
  show: boolean,
}

type State = {
  pseudo: Array<{text: string, ind: number}> | null,
  lines: Array<number>,
  showPseudo: boolean,
}
const mapStateToProps = (state: State) => {
  return {
    code: state.pseudo,
    lines: state.lines,
    show: state.showPseudo,
  }
}
const CodeLine = (props:{line:{text:string, ind: number}, current: boolean}) => {
  const {line, current} = props;
  return <span style={{backgroundColor: (current ? 'lightgray' : 'white'), display: 'block', paddingLeft: (line.ind *5).toString() + '%'}}>{line.text}</span>
}

class CodeBlock extends React.Component<Props>{
  render(){
    if(this.props.show || true){
      const {code, lines} = this.props;
      let codelines = [];
      if(code){
        for(let i = 0; i < code.length; i++){
          codelines.push(<CodeLine line = {code[i]} current = {lines && lines.includes(i)}/>);
        }
      }
      return (
        <div className='codeblock'>
          {codelines}
        </div>
      );
    }else return <></>
  }
}

export default connect(mapStateToProps)(CodeBlock);