import Sort from './BubbleSort-util';
const BinarySearch = (param, value) => {
  const values = Sort(param);
  const n = values.length;
  const positions = Array(n).fill().map((value, index) => index.toString());
  const defaultStyle = Array(n).fill({'border-width': 1});
  const commands = [];

  let lo = 0, hi = n - 1;

  while(lo <= hi){
    commands.push({
      eles: positions,
      style: defaultStyle,
      duration: 0,
    });
    const cmd = {eles: [], style: []};
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
    });
    if(values[mid] === value){
      commands.push({
        eles: [mid.toString()],
        style: [{'background-color': 'lightgreen'}],
      });
      break;
    }
    commands.push({
      eles: [mid.toString()],
      style: [{'background-color': 'white'}],
      duration: 0,
    });
    if(values[mid] < value) lo = mid + 1;
    else hi = mid - 1;
  }
  return commands;
}

export default BinarySearch;