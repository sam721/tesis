import React from 'react';
import { Row, Col} from 'react-bootstrap';


type ElementProps = {
  value: number | null,
  class?: string,
  
}
type Props = {
  array: Array<ElementProps>
}

const Element = (props: ElementProps) => {
  return (
    <td style={{ borderStyle: 'solid', borderWidth: '2px', textAlign: 'center', width: '3.125%' }} className={props.class}>
      {props.value}
    </td>
  );
};

const HeapArray = (props: Props) => {
  const cols = new Array(32).fill(<Element value={null} />);
  const header = (new Array(32)).fill(0).map((_x, index) => <th style={{textAlign: 'center'}}>{index}</th>);
  const { array } = props;


  for (let i = 0; i < array.length; i++) {
    cols[i] = <Element value={array[i].value} class={array[i].class} />
  }

  console.log(cols);
  return (
    <Row>
      <Col xs={12}>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr style={{ width: '100%' }}>
              {cols}
            </tr>
            <tr>
              {header}
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  );
}

export default HeapArray;