const BubbleSort = (param) => {
  const values = [];
  for(let i = 0; i < param.length; i++) values.push(param[i]);
  const n = values.length;

  const commands = [];
  for(let j = values.length; j > 0; j--){
    let sorted = true;
    for(let i = 0; i <  j - 1; i++){
      let bcolor;
      if(values[i] > values[i+1]){
        sorted = false;
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
        }
      )
    }
    if(sorted) break;
  }
  console.log(param);
  return commands;
}

export default BubbleSort;