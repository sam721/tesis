const mergeSortAnimation = (input, width, height) => {
  const commands = [];

  const mergeSort = (param, start, l, r, h) => {
    const values = [...param];
    const n = values.length;
    let cmd = {
      nodes: [],
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
    if(n === 1) return values;
    const mid = Math.floor((n+1)/2);
    const left = mergeSort(values.slice(0, mid), start, l, (l+r)/2, h + 50);
    const right = mergeSort(values.slice(mid), start + mid, (l+r)/2, r, h + 50);

    let li = 0, ri = 0;
    for(let i = 0; i < n; i++){

      const pos = p - (n-1)*(35/2) + 35*i;
      cmd = {
        nodes: [],
        duration: 1000,
      };
      if(li === left.length){
        cmd.nodes = [{id: right[ri].id, position: {x: pos, y: h}}];
        values[i] = right[ri++];
      }else if(ri === right.length){ 
        cmd.nodes = [{id: left[li].id, position: {x: pos, y: h}}];
        values[i] = left[li++];
      }else if(left[li].value <= right[ri].value){
        cmd.nodes = [{id: left[li].id, position: {x: pos, y: h}}];
        values[i] = left[li++];
      }else{
        cmd.nodes = [{id: right[ri].id, position: {x: pos, y: h}}];
        values[i] = right[ri++];
      }
      commands.push(cmd);
    }

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