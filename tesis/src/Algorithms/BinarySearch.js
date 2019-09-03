import Sort from './BubbleSort-util';
const BinarySearch = (param, value) => {
  const values = Sort(param);
  const n = values.length;
  const positions = Array(n).fill().map((value, index) => index.toString());
  const defaultStyle = Array(n).fill({'border-width': 1});
  const commands = [];

  let lo = 0, hi = n - 1;
  let found = false;
  while(lo <= hi){
    commands.push({
      eles: positions,
      style: defaultStyle,
      duration: 0,
    });
    const cmd = {eles: [], style: [], lines: [3]};
    for(let i = lo; i <= hi; i++){
      cmd.eles.push(i.toString());
      cmd.style.push({'border-width': 3});
    }
    commands.push(cmd);
    console.log(cmd);
    const mid = Math.floor((lo + hi)/2);
    commands.push({
      eles: [mid.toString()],
      style: [{'background-color': 'gray'}],
      lines: (values[mid] < value ? [7, 8] : (values[mid] > value ? [8, 9] : [4, 5])),
    });
    if(values[mid] === value){
      commands.push({
        eles: [mid.toString()],
        style: [{'background-color': 'lightgreen'}],
        lines: [4, 5],
      });
      found = true;
      break;
    }
    commands.push({
      eles: [mid.toString()],
      style: [{'background-color': 'white'}],
      lines: [],
    });
    if(values[mid] < value) lo = mid + 1;
    else hi = mid - 1;
  }
  if(!found) commands.push({eles: [], style: [], lines: [10]});
  return commands;
}

export default BinarySearch;