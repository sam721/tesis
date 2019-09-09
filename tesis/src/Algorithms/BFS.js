import Queue from './DS/Queue'
const Styles = require('../Styles/Styles');
const BFS = param => {
	const { cy, selection } = param;
	const source = selection.id;

	let color = {}, level = {};
	let q = new Queue();

	let commands = [{lines: [1,2], duration: 1000}];
	q.push(source);
	level[source] = 0;
	commands.push(
		{
			eles: [source],
			style: [Styles.NODE_GRAY],
			inst: [
				{
					name: 'update_level',
					data: {
						id: source,
						value: 0,
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
				style: [Styles.NODE_BLACK],
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
							Styles.EDGE_TRAVERSE 
						],
						lines: [8],
					},
					{ lines: [9]}
				);

				if (color[next.id()] === undefined) {
					color[next.id()] = 'gray';
					level[next.id()] = level[current.id()]+1;
					commands.push(
						{
							eles: [next.id()],
							style: [Styles.NODE_GRAY],
							inst: [
								{
									name: 'update_level',
									data: {
										id: next.id(),
										value: level[next.id()],
										class: 'heap-default',
									}
								}
							],
							lines: [10,11]
						},
						{
							eles: [edge.id()],
							style: [
								Styles.EDGE_VISITED,
							],
							duration: 10,
						}
					);
					q.push(next.id());
				}else{
					commands.push({
						eles: [edge.id()],
						style: [
							Styles.EDGE_VISITED,
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
