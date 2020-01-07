const BubbleSort = (param) => {
  const values = [];
  for(let i = 0; i < param.values.length; i++) values.push(param.values[i]);
  const n = values.length;

  const commands = [];
  for(let j = 0; j < n; j++){
    commands.push({eles: [], style: [], lines: [1,2]});
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
          lines: [4],
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
          lines: (swap ? [5,6] : [3])
        },
      );
      if(swap) commands.push({eles: [], style: [], lines: [3]});
    }
    if(sorted){
      commands.push({
        eles: [],
        style: [],
        lines:[7],
      });
      break;
    }
  }
  return commands;
}

export default BubbleSort;