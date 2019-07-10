import Queue from './DS/Queue'

const BFS = param => {
	const { cy, selection } = param;
	const source = selection.id;

	let color = {};
	let q = new Queue();

	let commands = [];

	q.push(source);

	while (!q.isEmpty()) {
		let current = cy.getElementById(q.front()); q.pop();
		if (color[current] === 'black') continue;
		color[current.id()] = 'black';
		commands.push({
			eles: [current.id()],
			style: [{ 'background-color': 'black', 'color': 'white' }],
		});
		current.outgoers('edge').forEach(
			edge => {
				let next = edge.target();
				if (color[next.id()] === undefined) {
					color[next.id()] = 'gray';
					commands.push(
						{
							eles: [next.id(), edge.id()],
							style: [
								{ 'background-color': 'gray', 'color': 'black' },
								{ 'line-color': 'green', 'target-arrow-color': 'green' }
							],
						},
						{
							eles: [edge.id()],
							style: [
								{ 'line-color': '#ccc', 'target-arrow-color': '#ccc' }
							],
							duration: 10,
						}
					);
					q.push(next.id());
				}
			}
		)
	}
	return commands;
}

export default BFS;
