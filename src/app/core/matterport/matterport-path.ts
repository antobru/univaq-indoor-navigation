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
		let node = await sdk.Scene.createNode();
		var xr = node.addComponent(MatterportPath.NAME, inputs);
		return node;
	}

	inputs: Inputs = {
		points: [],
        linewidth: 100
	};

	events = {
		[ComponentInteractionType.CLICK]: true,
	};

	constructor() {
		super();
	}

	onInit() {
		const THREE = this.context.three;

		const material = new THREE.LineBasicMaterial({ color: this.inputs.color || 0xCFFF04, linewidth: 10 });
		// const material = new THREE.LineDashedMaterial( {
		// 	color: 0xffffff,
		// 	linewidth: 5,
		// 	scale: 5,
		// 	dashSize: 3,
		// 	gapSize: 5,
		// } );
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
