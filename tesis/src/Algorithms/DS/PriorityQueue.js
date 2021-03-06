const Styles = require('../../Styles/Styles')
class PriorityQueue {
	_data = [0];
	_comp = null;
	_eq = null

	constructor(_comp = (x, y) => x >= y, _eq = (x, y) => x === y) {
		this._comp = _comp;
		this._eq = _eq;
	}

	isEmpty() {
		return this._data.length === 1;
	}

	length() {
		return this._data.length;
	}
	
	top() {
		if (this.isEmpty()) return null;
		return this._data[1];
	}

	push(ele, animation = false) {
		const commands = [];
		this._data.push(ele);
		let pos = this._data.length - 1;
		if (animation) {
			commands.push({
				eles: [pos.toString()],
				style: [Styles.NODE_BLACK],
				classes: ['heap-focus'],
				lines: [4],
			});
		}
		while (pos > 1) {
			let parent = Math.floor(pos / 2);
			if (this._comp(this._data[parent], this._data[pos]) || this._eq(this._data[parent], this._data[pos])) {
				if (animation) {
					commands.push(
						{
							eles: [parent.toString()],
							style: [Styles.NODE_CORRECT],
							classes: ['heap-correct'],
							lines: [-1],
						}
					);
				}
				break;
			}
			if (animation) {
				commands.push(
					{
						eles: [parent.toString()],
						style: [Styles.NODE_WRONG],
						classes: ['heap-wrong'],
						lines: [5,6,7],
					},
					{
						eles: [parent.toString(), pos.toString()],
						style:
							[
								Styles.NODE_BLACK,
								Styles.NODE,
							],
						data:
							[
								{ 'value': this._data[pos] },
								{ 'value': this._data[parent] }
							],
						classes:
							[
								'heap-focus',
								'heap-default',
							],
						lines: [4],
					}
				)
			}
			[this._data[parent], this._data[pos]] = [this._data[pos], this._data[parent]];
			pos = parent;
		}
		return commands;
	}

	pop(animation = false) {
		const commands = [];
		if (!this.isEmpty()) {
			let x = this._data[this._data.length - 1];
			this._data.pop();
			if (this.isEmpty()) return commands;
			let pos = 1;
			this._data[1] = x;

			if (animation) {
				commands.push({
					eles: [pos.toString()],
					style: [Styles.NODE_BLACK],
					classes: ['heap-focus'],
					lines: [5],
				});
			}

			while (2 * pos < this._data.length) {
				
				let l = this._data[2 * pos],
					r = (2 * pos + 1 < this._data.length ? this._data[2 * pos + 1] : null);
				x = this._data[pos];
				if (r == null) {
					if (this._comp(l, x)) {
						if (animation) {
							commands.push(
								{
									eles: [(2 * pos).toString()],
									style: [Styles.NODE_WRONG],
									classes: ['heap-wrong'],
									lines: [7, 8],
								},
								{
									eles: [pos.toString(), (2 * pos).toString()],
									style: [
										Styles.NODE,
										Styles.NODE_BLACK,
									],
									data: [
										{ 'value': this._data[2 * pos] },
										{ 'value': this._data[pos] }
									],
									classes: [
										'heap-default',
										'heap-focus',
									],
									lines: [11,12],
								}
							);
						}
						[this._data[2 * pos], this._data[pos]] = [this._data[pos], this._data[2 * pos]];
						pos = 2 * pos;
					} else break;
				} else {
					if ((this._comp(l, r) || this._eq(l, r)) && this._comp(l, x)) {
						if (animation) {
							commands.push(
								{
									eles: [(2 * pos).toString()],
									style: [Styles.NODE_WRONG],
									classes: ['heap-wrong'],
									lines: [7, 8],
								},
								{
									eles: [pos.toString(), (2 * pos).toString()],
									style: [
										Styles.NODE,
										Styles.NODE_BLACK,
									],
									data: [
										{ 'value': this._data[2 * pos] },
										{ 'value': this._data[pos] }
									],
									classes: [
										'heap-default',
										'heap-focus',
									],
									lines: [11, 12],
								}
							);
						}
						[this._data[2 * pos], this._data[pos]] = [this._data[pos], this._data[2 * pos]];
						pos = 2 * pos;
					} else if ((this._comp(r, l) || this._eq(r, l)) && this._comp(r, x)) {
						if (animation) {
							commands.push(
								{
									eles: [(2 * pos + 1).toString()],
									style: [Styles.NODE_WRONG],
									classes: ['heap-wrong'],
									lines: [9, 10],
								},
								{
									eles: [pos.toString(), (2 * pos + 1).toString()],
									style: [
										Styles.NODE,
										Styles.NODE_BLACK,
									],
									data: [
										{ 'value': this._data[2 * pos + 1] },
										{ 'value': this._data[pos] }
									],
									classes: [
										'heap-default',
										'heap-focus',
									],
									lines: [11,12],
								}
							);
						}
						[this._data[2 * pos + 1], this._data[pos]] = [this._data[pos], this._data[2 * pos + 1]];
						pos = 2 * pos + 1;
					} else break;
				}
			}
		}

		return commands;
	}

	clear(){
		while(!this.isEmpty()) this.pop();
	}
}

export default PriorityQueue;