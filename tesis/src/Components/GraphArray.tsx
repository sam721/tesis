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
    <td style={{ borderStyle: 'solid', borderWidth: '2px', textAlign: 'center', width: '3.125%', height: '30px'}} className={props.class}>
      {props.value}
    </td>
  );
};

const GraphArray = (props: Props) => {
  const cols = new Array(32).fill(<Element value={null} />);
  const { array } = props;


  for (let i = 0; i < array.length; i++) {
    if(array[i]) cols[i] = <Element value={array[i].value} class={array[i].class} />
  }

  console.log(array);
  return (
    <Row>
      <Col xs={12}>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr style={{ width: '100%' }}>
              {cols}
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  );
}

export default GraphArray;