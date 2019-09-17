export function isLeaf(node){
  return node.outgoers('node').length === 0;
}

export function getChildren(node){
  let left = null, right = null;
  let outgoers = node.outgoers('node');

  if (outgoers.length >= 1) left = outgoers[0];
  if (outgoers.length === 2) right = outgoers[1];
  if (left != null && right != null && left.data('value') > right.data('value')) {
    [left, right] = [right, left];
  }else if(left != null && left.data('value') > node.data('value')){
    [left, right] = [right, left];
  }else if(right != null && right.data('value') < node.data('value')){
    [left, right] = [right,left];
  }

  return [left, right];
}


export function lca(cy, x, y){
  while(x.id() !== y.id()){
    if(x.data('depth') < y.data('depth')) y = cy.getElementById(y.data('prev'));
    else if(x.data('depth') > y.data('depth')) x = cy.getElementById(x.data('prev'));
    else{
      x = cy.getElementById(x.data('prev'));
      y = cy.getElementById(y.data('prev'));
    }
  }
  return x;
}
function leftmost(node){
  while(true){
    const left = getChildren(node)[0];
    if(left == null) return node;
    node = left;
  }
}

export function inorderSuccessor(node){
  const right = getChildren(node)[1];
  return leftmost(right);  
}

export function getHeight(node){
  if(!node) return 0;
  return node.data('height');
}

export function validateBST(text, addNode, addEdge, clearGraph, balanced=true){
  let pos = 0, n = text.length, id = 0;
  const nodes = [], edges = [];
  const recursion = (min, max, parent=-1) => {
    if(text[pos] === '.'){
      pos++;
      return {correct: true, height: 0, balance: 0};
    }
    let sign = 1;
    if(text[pos] === '-'){
      sign = -1; pos++;
    }
    if(pos === n || text[pos] < '0' || text[pos] > '9'){
      return {correct: false};
    }
    let value = 0;
    while(pos < n && text[pos] >= '0' && text[pos] <= '9'){
      value = (value*10) + parseInt(text[pos++]);
    }
    value = value*sign;
    if(value <= min || value >= max) return {correct: false}
    const current = id++;
    if(pos === n || text[pos] !== '(') return {correct: false}
    pos++;
    const left = recursion(min, value, current);
    if(!left.correct || pos === n || text[pos] !== ')') return {correct: false}
    pos++;
    if(pos === n || text[pos] !== '(') return {correct: false}
    pos++;
    const right = recursion(value, max, current);
    if(!right.correct || pos === n || text[pos] !== ')') return {correct: false}
    pos++;

    const height = Math.max(left.height, right.height) + 1;
    const balance = right.height - left.height;

    if(balanced && Math.abs(balance) > 1){
      return {correct: false};
    }
    nodes.push({id: current.toString(), value, height, balance});
    if(parent !== -1){
      edges.push({
        source: parent.toString(),
        target: current.toString(),
      });
    }
    return {correct: true, height, balance};
  }

  const result = recursion(-Infinity, Infinity);
  if(!result.correct || pos !== n){
    return false;
  }

  clearGraph();
  nodes.forEach(node => {
    addNode(node.id, node.value, node.height, node.balance);
  });
  edges.forEach(edge => {
    addEdge(edge.source, edge.target);
  });

  return true;
}

export function parseAVL(root){
  let output = "";
  if(root.length === 0) return output;
  const recursion = node => {
    if(!node){
      output += ".";
      return;
    }
    output += node.data('value').toString();
    const [left, right] = getChildren(node);
    output += "("; recursion(left); output += ")";
    output += "("; recursion(right); output += ")";
  }

  recursion(root);

  let link = document.createElement('a');
  link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
  link.setAttribute('download', 'avl.txt');
  link.setAttribute('target', '_blank');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return output;
}
