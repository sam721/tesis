export type CytoscapeLayout = {
	run: () => void,
	stop: () => void,
}
export interface CytoscapeElement {
	id: () => string,
	style: 	(() => Object) | 
					((styleSheet: Object) => void)
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
	distance: Array<string>,
	duration: number,
}