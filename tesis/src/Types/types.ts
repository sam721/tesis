export type CytoscapeLayout = {
	run: () => void,
	stop: () => void,
}
export interface CytoscapeElement {
	id: () => string,
	style: ((styleSheet?: Object) => void | Object)
	outgoers: (selector?: string) => Array<CytoscapeElement>,
	data: ((selector: string, value?: any) => any)
	position: (pos?:{x:number, y:number}) => {x:number, y:number},
	source: () => CytoscapeElement,
	target: () => CytoscapeElement,
}

export interface CytoEvent extends Event {
	target: EventTarget & CytoscapeElement,
	position: {
		x: string,
		y: string,
	}
}

export type NODE = {
	position: {
		x: number,
		y: number,
	},
	id: string,
	value: string | number,
}

export type AnimationStep = {
	eles?: Array<string>,
	style?: Array<Object>,
	lines?: Array<number>,
	distance?: Array<string>,
	duration?: number,
	classes?: Array<string>,
	data?: Array<{value: number, class?: string}>,

	nodes?: Array<NODE>,
	inst?: Array<{name: string, position?: number, data?: {value?: number, id?: string, source?: string, target?: string, class?: string, pos?: number}}>,
	positions?: Array<{x: number, y: number}>
	tableValues?: Object,

	shadows?: Array<NODE>,
}