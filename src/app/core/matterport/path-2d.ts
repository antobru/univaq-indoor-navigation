import { Mesh, Object3D, Texture, WebGLRenderTarget } from "three";
import { ComponentOutput, SceneComponent } from "./SceneComponent";

export class Path2D extends SceneComponent {
	public static register(sdk) {
		sdk.Scene.register("mp.path2d", new Path2D());
	}

	private mesh: Mesh;
	private pivotNode: Object3D;

	


}

export interface IPainter2d {
	paint(context2d: CanvasRenderingContext2D, size: Size): void;
}

type Inputs = { painter: IPainter2d | null; textureRes: Size };
type Outputs = { texture: Texture | null } & ComponentOutput;
type Events = { repaint: boolean };
export type Size = { w: number; h: number };
