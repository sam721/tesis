import Queue from './DS/Queue'

const BFS = param => {
	const { cy, selection } = param;
	const source = selection.id;

	let color = {};
	let q = new Queue();

	let commands = [{line: 0, duration: 250}, {line: 1, duration: 250}];

	commands.push(
		{
			eles: [source],
			style: [{ 'background-color': 'gray', 'color': 'black' }],
			line: 3,
		}
	)

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
			],
			line: 4,
		}
	)
	
	while (!q.isEmpty()) {
		commands.push({ line: 5});
		let current = cy.getElementById(q.front()); q.pop();
		if (color[current] === 'black') continue;
		color[current.id()] = 'black';
		commands.push(
			{
				line: 6,
				inst: [
					{
						name: 'shift',
					}
				],
			},
			{
				eles: [current.id()],
				style: [{ 'background-color': 'black', 'color': 'white' }],

				line: 7,
			}
		);
		current.outgoers('edge').forEach(
			edge => {
				let next = edge.target();
				commands.push(
					{
						eles: [edge.id()],
						style: [
							{ 'line-color': 'green', 'target-arrow-color': 'green' }
						],
						line: 8,
					},
					{ line: 9}
				);

				if (color[next.id()] === undefined) {
					color[next.id()] = 'gray';
					commands.push(
						{
							eles: [next.id()],
							style: [{'background-color': 'gray', 'color': 'black'}],
							line: 10,
						},

						{
							inst: [
								{
									name: 'push',
									data: {
										value: next.data('value'),
										class: 'heap-default',
									}
								}
							],
							line: 11,
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
				}else{
					commands.push({
						eles: [edge.id()],
						style: [
							{ 'line-color': '#ccc', 'target-arrow-color': '#ccc' }
						],
						duration: 10,
					});
				}
			}
		)
	}
	return commands;
}

export default BFS;
