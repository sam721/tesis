const dfs = (cy, source, commands, visited) => {
    visited[source.id()] = true;
    commands.push({
        eles: [source.id()],
        style: [{ 'background-color': 'gray', 'color': 'black' }],
    });
    source.outgoers('edge').forEach(
        edge => {
            let next = edge.target();
            if (visited[next.id()] === undefined) {
                commands.push(
                    {
                        eles: [edge.id()],
                        style: [{ 'line-color': 'green', 'target-arrow-color': 'green' }],
                    },
                    {
                        eles: [edge.id()],
                        style: [{ 'line-color': '#ccc', 'target-arrow-color': '#ccc' }],
                        duration: 10,
                    }
                );
                dfs(cy, next, commands, visited);
            }
        }
    );
    commands.push({
        eles: [source.id()],
        style: [{ 'background-color': 'black', 'color': 'white' }],
    })
}
const DFS = param => {
    const { cy, selection } = param;
    const source = selection.id;

    let commands = [];
    let visited = {};
    dfs(cy, cy.getElementById(source), commands, visited);
    return commands;
}

export default DFS;