const BubbleSort = (param) => {
  const values = [];
  for(let i = 0; i < param.length; i++) values.push(param[i]);
  const n = values.length;

  const commands = [{eles: [], style: [], line: 0}];
  for(let j = 0; j < n; j++){
    for(let i = 0; i < 3; i++) commands.push({eles: [], style: [], line: i+1});
    let sorted = true;
    for(let i = 0; i < n-1; i++){
      let bcolor, swap=false;
      if(values[i] > values[i+1]){
        sorted = false; swap=true;
        [values[i], values[i+1]] = [values[i+1], values[i]];
        bcolor = 'LightCoral';
      }else bcolor = 'Chartreuse';

      commands.push(
        {
          eles: [i.toString(), (i+1).toString()],
          style: [
            {'background-color': bcolor},
            {'background-color': bcolor},
          ], 
          duration: 1000,
          line: 4,
        },
        {
          eles: [i.toString(), (i+1).toString()],
          style: [
            {'background-color': 'white'},
            {'background-color': 'white'},
          ],
          data: [
            {'value': values[i]},
            {'value': values[i+1]},
          ],
          duration: 1000,
          line: (swap ? 5 : 3)
        },
      );
      if(swap) commands.push({eles: [], style: [], line: 3});
    }
    if(sorted){
      commands.push({
        eles: [],
        style: [],
        line:7
      });
      break;
    }
  }
  return commands;
}

export default BubbleSort;