export function validateHeap(values){
  const n = values.length;
  for(let i = 1; 2*i < n; i++){
    const left = values[2*i], right = ((2*i + 1) === n ? Infinity : values[2*i+1]);
    console.log(values[i], left, right);
    if(left < values[i] || right < values[i]) return false;
  }
  return true;
}

export function parseHeap(values){
  const output = values.toString();
  let link = document.createElement('a');
  link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
  link.setAttribute('download', 'avl.txt');
  link.setAttribute('target', '_blank');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}