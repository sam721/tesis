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
      }]
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
        }]
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
      }]
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
        }]
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

  delete_position(pos){
    const n = this.length();
    const commands = [];
    if(pos >= n) return commands;
    for(let i = 0; i <= pos; i++){
      const id = this._data[i].id;
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
    const id = this._data[pos].id;
    let source, target;
    if(pos > 0 && pos + 1 < this.length()){
      source = this._data[pos-1].id;
      target = this._data[pos+1].id;
    }
    commands.push({
      inst: [{
        name: 'remove',
        data: {id, value: pos, source, target}
      }]
    });
    return commands;
  }


}

export default LinkedListSimulator;