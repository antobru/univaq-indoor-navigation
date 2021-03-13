import { Color, Mesh, MeshBasicMaterial, Object3D, Texture, Vector3 } from "three";
import { ComponentInteractionType, SceneComponent } from "./SceneComponent";

type Inputs = {
	points: Vector3[];
	color?: string | number | Color;
	linewidth?: number;
};

export class MatterportPath extends SceneComponent {
	public static NAME: string = "mp.matterport-path";
	public static register(sdk) {
		sdk.Scene.register(MatterportPath.NAME, () => new MatterportPath());
	}

	static async addNode(sdk, inputs = null) {
		await MatterportPath.register(sdk);
		let nodes = [];
		for (let i = 0; i < (inputs.stroke || 0.1); i += 0.003) {
			let _points = JSON.parse(JSON.stringify(inputs.points));
			_points.map((p) => {
				p.z += i;
				p.x += i;
			    p.y = 0.3;
				return p;
			});
			let node = await sdk.Scene.createNode();
			var xr = node.addComponent(MatterportPath.NAME, { points: _points, color: inputs.color });
			node.start();
			nodes.push(node);
		}
		return new MatterportPathInstance(nodes);
	}

	inputs: Inputs = {
		points: [],
		linewidth: 100,
	};

	events = {
		[ComponentInteractionType.CLICK]: true,
	};

	constructor() {
		super();
	}

	onInit() {
		const THREE = this.context.three;
		const material = new THREE.LineBasicMaterial({ color: this.inputs.color || 0xffffff || 0xcfff04, linewidth: 10 });
		const geometry = new THREE.BufferGeometry().setFromPoints(this.inputs.points);
		const line = new THREE.Line(geometry, material);
		this.outputs.objectRoot = line;
		this.outputs.collider = line;
	}

	onEvent(eventType: string, eventData: unknown) {
		this.notify(eventType, eventData);
	}

	onInputsUpdated(oldInputs: any) {}

	onDestroy() {
		this.outputs.collider = null;
		this.outputs.objectRoot = null;
	}
}

export class MatterportPathInstance {
	private nodes: any[];

	constructor(nodes: any[]) {
		this.nodes = nodes;
	}

	start() {
		for (let node of this.nodes) {
			node.start();
		}
	}

	stop() {
		for (let node of this.nodes) {
			node.stop();
		}
	}
}
