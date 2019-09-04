import React, { ReactElement } from 'react';
import { LINE_FOCUS, LINE_STD } from '../Styles/Styles';
const { connect } = require('react-redux');

type Props = {
  code: Array<{text: string, ind: number}> | null,
  lines: Array<number>,
}

type State = {
  pseudo: Array<{text: string, ind: number}> | null,
  lines: Array<number>,
}
const mapStateToProps = (state: State) => {
  return {
    code: state.pseudo,
    lines: state.lines,
  }
}
const CodeLine = (props:{line:{text:string, ind: number}, current: boolean, index: number}) => {
  const {line, current, index} = props;
  const focus = current ? LINE_FOCUS : LINE_STD;
  return (
    <div style={{...focus, paddingRight: '10px'}}>
      <div className='codeline'>
        {index}.
        <span style={{paddingLeft: (line.ind *15).toString() + 'px'}}>{line.text}</span>
      </div>
    </div>
  );
}

class CodeBlock extends React.Component<Props>{
  render(){
    if(this.props.code){
      const {code, lines} = this.props;
      let codelines = [];
      if(code){
        for(let i = 0; i < code.length; i++){
          codelines.push(<CodeLine index={i+1} line = {code[i]} current = {lines && lines.includes(i)}/>);
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