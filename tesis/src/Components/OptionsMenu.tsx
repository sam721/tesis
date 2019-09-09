import React from 'react';
type Props = {
  op: Array<{name: string, run: () => void}>,
}
const OptionsMenu = (props:Props) => {
  const {op} = props;
  const links = Array();
  op.forEach((option:{name:string, run: () => void}) => {
    const {name, run} = option;
    links.push(
      <button onClick={run}>{name}</button>
    );
  });
  return  (
    <>
      {links}
    </>
  );
}

export default OptionsMenu;