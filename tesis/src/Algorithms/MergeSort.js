const mergeSortAnimation = (input, width, height) => {
  const commands = [];

  const mergeSort = (param, start, l, r, h) => {
    const values = [...param];
    const n = values.length;
    const nodes = [], focus = [], nofocus = [], positions = [];
    let cmd = {
      nodes: [],
      duration: 1000,
      style: [],
    }
    const p = (l + r)/2;
    values.forEach((value, index) => {
      nodes.push({
        id: (start + index).toString(),
      });
      positions.push({
        x: p - (n-1)*(35/2) + 35*(index),
        y: h,
      });
      focus.push({
        'border-width': '3',
      });
      nofocus.push({
        'border-width': '1',
      })
    });
    commands.push({nodes, style: focus, positions});
    commands.push({nodes: [], lines: [1]});
    if(n === 1){
      commands.push({nodes: [], lines: [2]});
      return values;
    }
    const mid = Math.floor((n+1)/2);
    commands.push({nodes: [], lines:[3]});
    commands.push({nodes, style: nofocus, duration: 10});
    const left = mergeSort(values.slice(0, mid), start, l, (l+r)/2, h + 50);
    commands.push({nodes, style: focus, duration: 10});
    commands.push({nodes: [], lines:[4]});
    commands.push({nodes, style: nofocus, duration: 10});
    const right = mergeSort(values.slice(mid), start + mid, (l+r)/2, r, h + 50);
    commands.push({nodes, style: focus, duration: 10});
    let li = 0, ri = 0;
    commands.push({nodes: [], lines: [5]}, {nodes: [], lines: [8,9]});
    for(let i = 0; i < n; i++){
      commands.push({nodes: [], lines: [10]});
  
      const pos = p - (n-1)*(35/2) + 35*i;
      cmd = {
        nodes: [],
        duration: 1000,
      };
      commands.push({nodes:[], lines: [11]});

      if(ri == right.length || (li < left.length && left[li].value<=right[ri].value)){
        cmd.nodes = [{id: left[li].id}];
        cmd.lines = [12];
        cmd.positions = [{x: pos, y: h}];
        values[i] = left[li++];
      }else{
        commands.push({nodes: [], lines: [13]});
        cmd.nodes = [{id: right[ri].id}];
        cmd.positions = [{x: pos, y: h}];
        values[i] = right[ri++];
        cmd.lines=[14];
      }
      commands.push(cmd);
    }
    commands.push({nodes: [], lines: [15]});
    commands.push({nodes: [], lines: [5]});
    commands.push({nodes, style: nofocus});
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