class Queue {
    _data = [];

    constructor(){

    }

    isEmpty(){
        return this._data.length === 0;
    }   

    front(){
        if(this.isEmpty()){
            return null;
        }
        return this._data[0];
    }

    push(ele){
        this._data.push(ele);
    }

    pop(){
        if(!this.isEmpty()){
            this._data.shift();
        }
    }

}

export default Queue;