const Sort = (param) => {
  const values = [];
  for(let i = 0; i < param.length; i++) values.push(param[i]);
  const n = values.length;
  for(let j = 0; j < n; j++){
    let sorted = true;
    for(let i = 0; i < n-1; i++){
      if(values[i] > values[i+1]){
        sorted = false; 
        [values[i], values[i+1]] = [values[i+1], values[i]];
      }
    }
    if(sorted) break;
  }
  return values;
}

export default Sort;