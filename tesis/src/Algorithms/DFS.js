const Styles = require('../Styles/Styles');
const dfs = (cy, source, depth, commands, visited) => {

	visited[source.id()] = true;
	
	commands.push({
		eles: [source.id()],
		style: [Styles.NODE_GRAY],
		inst: [
			{
				name: 'update_level',
				data: {id: source.id(), value: depth}
			}
		],
		lines: [1],
	});
	source.outgoers('edge').forEach(
		edge => {
			let next = edge.target();
			commands.push(
				{
					eles: [edge.id()],
					style: [Styles.EDGE_TRAVERSE],
					lines: [2],
				},
			);
			if (visited[next.id()] === undefined) {
				commands.push(
					{
						lines: [3,4],
					},
					{
						eles: [edge.id()],
						style: [Styles.EDGE_VISITED],
						duration: 10,
					},
				);
				dfs(cy, next, depth+1, commands, visited);
			}else{
				commands.push({
					eles: [edge.id()],
					style: [Styles.EDGE_VISITED],
					duration: 10,
				});
			}
		}
	);
	commands.push({
		eles: [source.id()],
		style: [Styles.NODE_BLACK],
		inst: [{name: 'pop'}],
		lines: [5],
	})
}
const DFS = param => {
	const { cy, selection } = param;
	const source = selection.id;

	let commands = [
		{lines: [8,9,10]},
	];
	let visited = {};
	dfs(cy, cy.getElementById(source), 0, commands, visited);
	return commands;
}

export default DFS;