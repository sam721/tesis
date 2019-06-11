import React from 'react';
const Sidebar = props => {
	return (
		<ul>
			<li className="menu-item" href="/">
				Home
			</li>

			<li className="menu-item" href="/burgers">
				Burgers
			</li>

			<li className="menu-item" href="/pizzas">
				Pizzas
			</li>

			<li className="menu-item" href="/desserts">
					Desserts
			</li>
		</ul>
	);
}

export default Sidebar;