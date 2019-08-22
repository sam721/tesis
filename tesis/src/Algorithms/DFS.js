const dfs = (cy, source, commands, visited) => {
	commands.push({
		line: 0,
	});

	visited[source.id()] = true;

	commands.push({
		eles: [source.id()],
		style: [{ 'background-color': 'gray', 'color': 'black' }],
		inst: [
			{
				name: 'push',
				data: {value: source.data('value'), class: 'heap-default'}
			}
		],
		line: 1,
	});
	source.outgoers('edge').forEach(
		edge => {
			let next = edge.target();
			commands.push(
				{
					eles: [edge.id()],
					style: [{ 'line-color': 'green', 'target-arrow-color': 'green' }],
					line: 2,
				},
				{
					line: 3,
				}
			);
			if (visited[next.id()] === undefined) {
				commands.push(
					{
						line: 4,
					},
					{
						eles: [edge.id()],
						style: [{ 'line-color': '#ccc', 'target-arrow-color': '#ccc' }],
						duration: 10,
					},
				);
				dfs(cy, next, commands, visited);
			}else{
				commands.push({
					eles: [edge.id()],
					style: [{ 'line-color': '#ccc', 'target-arrow-color': '#ccc' }],
					duration: 10,
				});
			}
		}
	);
	commands.push({
		eles: [source.id()],
		style: [{ 'background-color': 'black', 'color': 'white' }],
		inst: [{name: 'pop'}],
		line: 5,
	})
}
const DFS = param => {
	const { cy, selection } = param;
	const source = selection.id;

	let commands = [
		{line: 7, duration: 250},
		{line: 8, duration: 250},
		{line: 9, duration: 250},
		{line: 10},
	];
	let visited = {};
	dfs(cy, cy.getElementById(source), commands, visited);
	return commands;
}

export default DFS;