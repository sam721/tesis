import actions from "../../Actions/actions";

// Simple array used to create commands for Linked List Animation

class LinkedListSimulator {
  _data = [];

  constructor(data = [], type = 'none'){
    this._data = [...data];
    this.type = type;
  }
  length(){
    return this._data.length;
  }

  push_back(element, slow){
    const {id, value} = element;
    let source = undefined;
    const commands = [];
    let lines;
    if(this.length() === 0){
      commands.push({lines: [2,3]});
    }else{
      if(this.type === actions.SELECT_QUEUE){
        lines = [4, 5, 6];
      }else if(this.type === actions.SELECT_DOUBLE_LINKED_LIST){
        lines = [4, 5, 6, 7];
      }
    }
    if(slow){
      for(let i = 0; i < this.length(); i++){
        const {id} = this._data[i];
        commands.push(
          { eles: [id], style: [{'background-color': 'black', 'color': 'white'}], lines: [6, 7]},
          { eles: [id], style: [{'background-color': 'white', 'color': 'black'}], duration: 10 },
        )
      }
    }
    if(this.length()){
      source = this._data[this.length()-1].id;
    }

    if(this.type === actions.SELECT_SINGLE_LINKED_LIST) lines = [8];
    commands.push({
      eles: [], style: [],
      inst: [{
        name: 'push_back',
        data: {
          id, value, source,
        }
      }],
      lines,
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
        let lines;
        if(this.length() === 1) lines = [2, 3, 4, 5];
        else lines = [7, 8, 9];
        commands.push(
          { eles: [id], style: [{'background-color': 'black', 'color': 'white'}], lines},
          { eles: [id], style: [{'background-color': 'white', 'color': 'black'}], duration: 10 },
        )
      }
    }
    const {id} = this._data[this.length()-1];
    let lines;
    if(this.type === actions.SELECT_SINGLE_LINKED_LIST && this.length() > 1) lines = [10, 11];
    else if(this.type === actions.SELECT_DOUBLE_LINKED_LIST){
      commands.push({
        eles: [id], 
        style: [{'background-color': 'black', 'color':'white'}], 
        lines: [2, 3],
      });
      if(this.length() === 1) lines = [4, 5];
      else lines = [6,7];
    }
    commands.push(
      {
        eles: [], style: [],
        inst: [{
          name: 'pop_back',
          data: { id, value: this.length()-1},
        }],
        lines,
      }
    );
    return commands;
  }

  push_front(element){
    const {id, value} = element;
    let target = undefined;
    if(this.length()) target = this._data[0].id;
    let lines;
    if(this.length() === 0){
      lines = [2,3];
    }else{
      if(this.type === actions.SELECT_SINGLE_LINKED_LIST) lines = [4,5,6];
      else if(this.type === actions.SELECT_DOUBLE_LINKED_LIST) lines = [4,5,6,7];
      else if(this.type === actions.SELECT_STACK) lines = [4,5,6];
    }
    const commands = [{
      eles: [], style: [],
      inst: [{
        name: 'push_front',
        data: {
          id, value, target,
        }
      }],
      lines,
    }]
    return commands;
  }

  pop_front(){
    if(this.length() === 0) return [{eles: [], style: []}];
    const {id} = this._data[0];
    let lines;
    const commands = [];
    if(this.type === actions.SELECT_SINGLE_LINKED_LIST || this.type === actions.SELECT_STACK) lines = [2,3,4];
    else if(this.type === actions.SELECT_DOUBLE_LINKED_LIST){
      commands.push({
        eles: [id], style: [{'background-color': 'black', 'color': 'white'}],
        lines: [2, 3],
      });
      if(this.length() === 1) lines = [4, 5];
      else lines = [6, 7];
    }else{
      if(this.length() === 1) lines = [3,4];
      else lines = [5,6];
    }
    commands.push(
      {
        eles: [], style: [],
        inst: [{
          name: 'pop_front',
          data: { id },
        }],
        lines,
      }
    );
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
      if(nodeId === id) break;
      if(slow){
        commands.push(
          {
            eles: [id],
            style: [{ 'background-color': 'black', 'color': 'white'}],
            lines: [7, 8],
          },
          {
            eles: [id],
            style: [{ 'background-color': 'white', 'color': 'black'}],
            duration: 10,
          }
        );
      }
      
    }
    if(i === n) return commands;
    const pos = i;
    let prev = '', next = nodeId;
    let lines;
    if(this.type === actions.SELECT_SINGLE_LINKED_LIST){
      if(pos === 0) lines = [2, 3, 4];
      else lines = [9, 10];
    }else{
      if(pos === 0) lines = [5, 6];
      else lines = [7, 8];
    }
    if(pos - 1 >= 0){
      prev = this._data[pos-1].id;
      commands.push({
        inst: [
          {
            name: 'remove_edge',
            data: {source: prev, target: next}
          }
        ],
        lines: (this.type === actions.SELECT_DOUBLE_LINKED_LIST ? [2, 3, 4] : undefined),
        duration: 500,
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
      lines,
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
            duration: 500,
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
            data: {source: prev, target: next},
            duration: 500,
          }
        ],
        lines: (this.type === actions.SELECT_DOUBLE_LINKED_LIST ? [2, 3, 4] : [2, 3]),
      });
    }
    let lines;
    if(this.type === actions.SELECT_DOUBLE_LINKED_LIST){
      lines = (pos === this.length() - 1 ? [5, 6] : [7, 8]);
    }else lines = [4];
    
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
      lines,
      duration: 500,
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
        let lines;
        if(nodeId === id && i === 0) lines = [1, 2];
        else lines = [6, 7, 8];
        commands.push(
          {
            eles: [id],
            style: [{ 'background-color': 'black', 'color': 'white'}],
            duration: 500,
            lines,
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
    let lines;
    if(this.type === actions.SELECT_SINGLE_LINKED_LIST){
      if(pos === 0) lines = [3];
      else lines = [9, 10];
    }else if(this.type === actions.SELECT_DOUBLE_LINKED_LIST){
      let caseLines;
      if(this.length() === 1) caseLines = [2, 3];
      else if(pos === 0) caseLines = [4, 5];
      else if(pos === this.length() - 1) caseLines = [6, 7];
      else caseLines = [8, 9];
      commands.push({
        eles: [nodeId], style: [{'background-color': 'black', 'color': 'white'}],
        lines: caseLines,
      });

      lines = [10];
    }

    commands.push({
      inst: [{
        name: 'remove',
        data: {id: nodeId, value: pos, source, target}
      }],
      lines,
      duration: 500,
    });
    return commands;
  }


}

export default LinkedListSimulator;