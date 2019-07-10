export default class DisjointSet {
  _parent = {}
  constructor(nodes){
    nodes.forEach(node => this._parent[node.id()] = node.id());
  }

  find(node){
    if(this._parent[node] === node) return node;
    this._parent[node] = this.find(this._parent[node]);
    return this._parent[node];
  }

  join(nodeX, nodeY){
    this._parent[this.find(nodeX)] = this.find(nodeY);
  }

  connected(nodeX, nodeY){
    return this.find(nodeX) === this.find(nodeY);
  }
}

