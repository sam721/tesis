export type CytoscapeLayout = {
	run: () => void,
	stop: () => void,
}
export interface CytoscapeElement {
	id: () => string,
	style: 	(() => Object) | 
					((styleSheet: Object) => void)
	outgoers: (selector?: string) => Array<CytoscapeElement>,
	data: ((selector: string, value?: any) => any)
}

export interface CytoEvent extends Event {
	target: EventTarget & CytoscapeElement,
	position: {
		x: string,
		y: string,
	}
}

export type AnimationStep = {
	eles: Array<string>,
	style: Array<Object>,
	distance?: Array<string>,
	duration?: number,
	classes?: Array<string>,
	data?: Array<{value: number, class?: string}>,

	inst?: Array<{name: string, position?: number, data?: {value: number, class?: string}}>,
}