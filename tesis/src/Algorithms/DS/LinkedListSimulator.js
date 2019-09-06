// Simple array used to create commands for Linked List Animation

class LinkedListSimulator {
  _data = [];
  _type;
  constructor(type){
    this._type = type;
  }
  length(){
    return this._data.length;
  }

  push_back(element, slow){
    const {id, value} = element;
    let source = undefined;
    const commands = [];
    if(slow){
      for(let i = 0; i < this.length(); i++){
        const {id} = this._data[i];
        commands.push(
          { eles: [id], style: [{'background-color': 'black', 'color': 'white'}] },
          { eles: [id], style: [{'background-color': 'white', 'color': 'black'}], duration: 10 },
        )
      }
    }
    if(this.length()) source = this._data[this.length()-1].id;
    commands.push({
      eles: [], style: [],
      inst: [{
        name: 'push_back',
        data: {
          id, value, source,
        }
      }],
      duration: 10,
    });
    console.log(commands);
    return commands;
  }

  pop_back(slow){
    if(this.length() === 0) return [];
    const commands = [];
    if(slow){
      for(let i = 0; i < this.length(); i++){
        const {id} = this._data[i];
        commands.push(
          { eles: [id], style: [{'background-color': 'black', 'color': 'white'}] },
          { eles: [id], style: [{'background-color': 'white', 'color': 'black'}], duration: 10 },
        )
      }
    }
    const {id} = this._data[this.length()-1];
    commands.push(
      {
        eles: [], style: [],
        inst: [{
          name: 'pop_back',
          data: { id, value: this.length()-1},
        }],
        duration: 10,
      }
    );
    return commands;
  }

  push_front(element){
    const {id, value} = element;
    let target = undefined;
    if(this.length()) target = this._data[0].id;
    //this._data.unshift(element);
    const commands = [{
      eles: [], style: [],
      inst: [{
        name: 'push_front',
        data: {
          id, value, target,
        }
      }],
      duration: 10,
    }]
    return commands;
  }

  pop_front(){
    if(this.length() === 0) return [{eles: [], style: []}];
    const {id} = this._data[0];
    const commands = [
      {
        eles: [], style: [],
        inst: [{
          name: 'pop_front',
          data: { id },
        }],
        duration: 10,
      }
    ];
    //this._data.shift();
    return commands;
  }

  search(value){
    const n = this.length();
    const commands = [];
    for(let i = 0; i < n; i++){
      //Animations steps here
      const id = this._data[i].id;
      commands.push({
        eles: [id],
        style: [{ 'background-color': 'black', 'color': 'white'}],
      });

      if(this._data[i].value === value){
        commands.push({
          eles: [id],
          style: [{'background-color': 'lightgreen', 'color': 'black'}],
        })
        return true;
      }
      commands.push({
        eles: [id],
        style: [{'background-color': 'white', 'color': 'black'}],
        duration: 10,
      })
    }
    return commands;
  }

  insert_before(nodeId, newId, value, slow = false){
    const n = this.length();
    const commands = [];
    let i;
    for(i = 0; i < n; i++){
      const id = this._data[i].id;
      if(slow){
        commands.push(
          {
            eles: [id],
            style: [{ 'background-color': 'black', 'color': 'white'}],
            duration: 1000,
          },
          {
            eles: [id],
            style: [{ 'background-color': 'white', 'color': 'black'}],
            duration: 10,
          }
        );
      }
      if(nodeId === id) break;
    }
    if(i === n) return commands;
    const pos = i;
    let prev = '', next = nodeId;
    if(pos - 1 >= 0) prev = this._data[pos-1].id;
    if(pos - 1 >= 0){
      commands.push({
        inst: [
          {
            name: 'remove_edge',
            data: {source: prev, target: next}
          }
        ]
      });
    }
    commands.push({
      inst: [
        {
          name: 'add_node_before',
          data: {id: newId, value, pos},
        },
        {
          name: 'add_edge',
          data: {source: prev, target: newId},
        },
        {
          name: 'add_edge',
          data: {source: newId, target: next},
        },
      ],
      duration: 10,
    });
    return commands;
  }

  insert_after(nodeId, newId, value, slow = false){
    const n = this.length();
    const commands = [];
    let i;
    for(i = 0; i < n; i++){
      const id = this._data[i].id;
      if(slow){
        commands.push(
          {
            eles: [id],
            style: [{ 'background-color': 'black', 'color': 'white'}],
            duration: 1000,
          },
          {
            eles: [id],
            style: [{ 'background-color': 'white', 'color': 'black'}],
            duration: 10,
          }
        );
      }
      if(nodeId === id) break;
    }
    if(i === n) return commands;
    const pos = i;
    let prev = nodeId, next = '';
    if(pos + 1 < this.length()) next = this._data[pos+1].id;
    if(pos + 1 < this.length()){
      commands.push({
        inst: [
          {
            name: 'remove_edge',
            data: {source: prev, target: next}
          }
        ]
      });
    }
    commands.push({
      inst: [
        {
          name: 'add_node',
          data: {id: newId, value, pos},
        },
        {
          name: 'add_edge',
          data: {source: prev, target: newId},
        },
        {
          name: 'add_edge',
          data: {source: newId, target: next},
        },
      ],
      duration: 10,
    });

    return commands;
  }
  delete_position(nodeId, slow = false){
    const n = this.length();
    const commands = [];
    let i;
    for(i = 0; i < n; i++){
      const id = this._data[i].id;
      if(slow){
        commands.push(
          {
            eles: [id],
            style: [{ 'background-color': 'black', 'color': 'white'}],
            duration: 1000,
          },
          {
            eles: [id],
            style: [{ 'background-color': 'white', 'color': 'black'}],
            duration: 10,
          }
        );
      }
      if(nodeId === id) break;
    }
    if(i === n) return commands;
    const pos = i;
    let source, target;
    if(pos > 0 && pos + 1 < this.length()){
      source = this._data[pos-1].id;
      target = this._data[pos+1].id;
    }
    commands.push({
      inst: [{
        name: 'remove',
        data: {id: nodeId, value: pos, source, target}
      }],
      duration: 10,
    });
    return commands;
  }


}

export default LinkedListSimulator;