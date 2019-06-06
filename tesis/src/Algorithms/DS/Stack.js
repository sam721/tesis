class Stack {

    _data = [];

    top(){
        if(this.isEmpty()){
            return null;
        }
        return this._data[this._data.length-1];
    }

    push(ele){
        this._data.push(ele);
    }

    pop(){
        if(!this.isEmpty()){

        }
    }
    isEmpty(){
        return this._data.length === 0;
    }

}

export default Stack;