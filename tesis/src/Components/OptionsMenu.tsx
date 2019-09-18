import React from 'react';
type Props = {
  op: Array<{name: string, run: () => void}>,
}
const OptionsMenu = (props:Props) => {
  const {op} = props;
  const links:Array<JSX.Element> = [];
  op.forEach((option:{name:string, run: () => void}, index:number) => {
    const {name, run} = option;
    links.push(
      <button key={index} onClick={run}>{name}</button>
    );
  });
  return  (
    <>
      {links}
    </>
  );
}

export default OptionsMenu;