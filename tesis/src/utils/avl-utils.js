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
