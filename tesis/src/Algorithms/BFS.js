import Queue from './DS/Queue'

const BFS = (cy, source) => {

    let color = {};
    let q = new Queue();

    let commands = [];

    q.push(source);

    while(!q.isEmpty()){
        let current = cy.getElementById(q.front()); q.pop();
        if(color[current] === 'black') continue;
        color[current.id()] = 'black';
        commands.push({
            node: current.id(),
            paint: 'black',
        });
        current.outgoers('node').forEach(
            next => {
                if(color[next.id()] === undefined){
                    color[next.id()] = 'gray';
                    commands.push({
                        node: next.id(),
                        paint: 'gray',
                    })
                    q.push(next.id());
                }
            } 
        )
    }
    
    return commands;
}

export default BFS;
