import Sort from './BubbleSort-util';
const BinarySearch = (param, value) => {
  const values = Sort(param);
  const n = values.length;
  const positions = Array(n).fill().map((value, index) => index.toString());
  const defaultStyle = Array(n).fill({'border-width': 1, 'z-index': 0});
  const commands = [];

  let lo = 0, hi = n - 1;
  let found = false;
  while(lo <= hi){
    commands.push({
      eles: positions,
      style: defaultStyle,
      duration: 0,
    });
    const cmd = {eles: [], style: []};
    for(let i = lo; i <= hi; i++){
      cmd.eles.push(i.toString());
      cmd.style.push({'border-width': 3, 'z-index': 1});
    }
    commands.push(cmd);
    const mid = Math.floor((lo + hi)/2);
    commands.push({
      eles: [mid.toString()],
      style: [{'background-color': 'gray', 'z-index': 2}],
      lines: [3],
    });
    commands.push({
      lines: (value < values[mid] ? [6, 7] : (values[mid] < value ? [8, 9] : [4, 5])),
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
      style: [{'background-color': 'white', 'z-index': 1}],
      duration: 10,
    });
    if(values[mid] < value) lo = mid + 1;
    else hi = mid - 1;
  }
  if(!found) commands.push({eles: [], style: [], lines: [10]});
  return commands;
}

export default BinarySearch;