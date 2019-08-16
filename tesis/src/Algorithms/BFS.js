import Queue from './DS/Queue'

const BFS = param => {
	const { cy, selection } = param;
	const source = selection.id;

	let color = {};
	let q = new Queue();

	let commands = [];

	q.push(source);
	commands.push(
		{
			inst: [
				{
					name: 'push',
					data: {
						value: cy.getElementById(source).data('value'),
						class: 'heap-default',
					}
				}
			]
		}
	)
	while (!q.isEmpty()) {
		let current = cy.getElementById(q.front()); q.pop();
		if (color[current] === 'black') continue;
		color[current.id()] = 'black';
		commands.push({
			eles: [current.id()],
			style: [{ 'background-color': 'black', 'color': 'white' }],
			inst: [
				{
					name: 'shift',
				}
			]
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
							inst: [
								{
									name: 'push',
									data: {
										value: next.data('value'),
										class: 'heap-default',
									}
								}
							]
						},
						{
							eles: [edge.id()],
							style: [
								{ 'line-color': '#ccc', 'target-arrow-color': '#ccc' }
							],
							duration: 1000,
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
