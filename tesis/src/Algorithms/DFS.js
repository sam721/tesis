const dfs = (cy, source, commands, visited) => {
    if(visited[source.id()]) return;
    visited[source.id()] = true;
    commands.push({
        node: source.id(),
        paint: 'gray',
    });
    source.outgoers('node').forEach(
        next => dfs(cy, next, commands, visited)
    );
    commands.push({
        node: source.id(),
        paint: 'black',
    })
}
const DFS = (cy, source) => {
    let commands = [];
    let visited = {};
    dfs(cy, cy.getElementById(source), commands, visited);
    return commands;
}

export default DFS;