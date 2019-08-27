const mergeSortAnimation = (input, width, height) => {
  const commands = [];

  const mergeSort = (param, start, l, r, h) => {
    const values = [...param];
    const n = values.length;
    if(start === 0 && l === 0) console.log(h);
    let cmd = {
      nodes: [],
      line: 0,
      duration: 1000,
    }
    const p = (l + r)/2;
    values.forEach((value, index) => {
      cmd.nodes.push({
        id: (start + index).toString(),
        position: {
          x: p - (n-1)*(35/2) + 35*(index),
          y: h,
        }
      })
    });
    commands.push(cmd);
    commands.push({nodes: [], line: 1});
    if(n === 1){
      commands.push({nodes: [], line: 2});
      return values;
    }
    const mid = Math.floor((n+1)/2);
    commands.push({nodes: [], line:3});
    const left = mergeSort(values.slice(0, mid), start, l, (l+r)/2, h + 50);
    commands.push({nodes: [], line:4});
    const right = mergeSort(values.slice(mid), start + mid, (l+r)/2, r, h + 50);

    let li = 0, ri = 0;
    commands.push({nodes: [], line: 5});
    commands.push({nodes: [], line: 7});
    for(let i = 0; i < n; i++){
      commands.push({nodes: [], line: 10});
  
      const pos = p - (n-1)*(35/2) + 35*i;
      cmd = {
        nodes: [],
        duration: 1000,
      };
      commands.push({nodes:[], line: 11});

      if(ri == right.length || (li < left.length && left[li].value<=right[ri].value)){
        cmd.nodes = [{id: left[li].id, position: {x: pos, y: h}}];
        cmd.line = 12;
        values[i] = left[li++];
      }else{
        commands.push({nodes: [], line: 13});
        cmd.nodes = [{id: right[ri].id, position: {x: pos, y: h}}];
        values[i] = right[ri++];
        cmd.line=14;
      }
      commands.push(cmd);
    }
    commands.push({nodes: [], line: 15});
    commands.push({nodes: [], line: 5});
    return values;
  }

  input = input.map((value, index) => {
    return {
      value, id: index.toString(),
    }
  });

  mergeSort(input, 0, 0, width, height/4);
  return commands;
}

export default mergeSortAnimation;