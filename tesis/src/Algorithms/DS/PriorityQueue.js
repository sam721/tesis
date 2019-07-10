class PriorityQueue{ 
    _data = [0];
    _comp = null;

    constructor(_comp = (x,y) => x >= y){
        this._comp = _comp;
    }

    isEmpty(){
        return this._data.length === 1;
    }

    top(){
        if(this.isEmpty()) return null;
        return this._data[1];
    }

    push(ele){
        this._data.push(ele);
        let pos = this._data.length - 1;
        while(pos > 1){
            let parent = Math.floor(pos/2);
            if(this._comp(this._data[parent], this._data[pos])) break;
            [this._data[parent], this._data[pos]] = [this._data[pos], this._data[parent]];
            pos = parent;
        }
    }

    pop(){
        if(!this.isEmpty()){
            let x = this._data[this._data.length - 1];
            this._data.pop();
            if(this.isEmpty()) return;
            let pos = 1;
            this._data[1] = x;
            while(2*pos < this._data.length){
                let l = this._data[2*pos],
                    r = (2*pos + 1 < this._data.length ? this._data[2*pos+1] : null);
                x = this._data[pos];
                if(r == null){
                    if(this._comp(l, x)){
                        [this._data[2*pos], this._data[pos]] = [this._data[pos], this._data[2*pos]];
                        pos = 2*pos;
                    }else break;
                }else{
                    if(this._comp(l, r) && this._comp(l, x)){
                        [this._data[2*pos], this._data[pos]] = [this._data[pos], this._data[2*pos]];
                        pos = 2*pos;
                    }else if(!this._comp(l, r) && this._comp(r, x)){
                        [this._data[2*pos+1], this._data[pos]] = [this._data[pos], this._data[2*pos+1]];
                        pos = 2*pos+1;
                    }else break;
                }
            }
        }
    }
}

export default PriorityQueue;