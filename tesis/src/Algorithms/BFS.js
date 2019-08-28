import Queue from './DS/Queue'

const BFS = param => {
	const { cy, selection } = param;
	const source = selection.id;

	let color = {};
	let q = new Queue();

	let commands = [{lines: [1,2], duration: 1000}];
	q.push(source);
	commands.push(
		{
			eles: [source],
			style: [{ 'background-color': 'gray', 'color': 'black' }],
			inst: [
				{
					name: 'push',
					data: {
						value: cy.getElementById(source).data('value'),
						class: 'heap-default',
					}
				}
			],
			lines: [3,4],
		}
	)
	
	while (!q.isEmpty()) {
		commands.push({ lines: [5]});
		let current = cy.getElementById(q.front()); q.pop();
		if (color[current] === 'black') continue;
		color[current.id()] = 'black';
		commands.push(
			{
				eles: [current.id()],
				style: [{ 'background-color': 'black', 'color': 'white' }],
				lines: [6,7],
				inst: [
					{
						name: 'shift',
					}
				],
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
						lines: [8],
					},
					{ lines: [9]}
				);

				if (color[next.id()] === undefined) {
					color[next.id()] = 'gray';
					commands.push(
						{
							eles: [next.id()],
							style: [{'background-color': 'gray', 'color': 'black'}],
							inst: [
								{
									name: 'push',
									data: {
										value: next.data('value'),
										class: 'heap-default',
									}
								}
							],
							lines: [10,11]
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
