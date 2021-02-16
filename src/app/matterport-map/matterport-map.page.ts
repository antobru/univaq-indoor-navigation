import { Component, OnInit } from "@angular/core";
import { NavigationTree } from "../core/navigation-tree";
import { Path2D as MPPath2D } from "../core/matterport/path-2d";
import * as THREE from "three";
import { PlaneRenderer, registerPlaneRenderer } from "../core/matterport/PlaneRenderer";
import { canvasBorderType, registerCanvasBorder } from "../core/matterport/CanvasBorder";
import { MatterportPath } from "../core/matterport/matterport-path";
import { Color } from "three";

//declare var MP_SDK: any;

@Component({
	selector: "app-matterport-map",
	templateUrl: "./matterport-map.page.html",
	styleUrls: ["./matterport-map.page.scss"],
})
export class MatterportMapPage implements OnInit {
	public iframe: HTMLElement;
	public SDK: any;
	public navigationTree: NavigationTree;
	public sweeps: any;
	showcaseSize: { w: any; h: any };
	cameraPose: any;

	constructor() {}

	ngOnInit() {
		this.iframe = document.getElementById("map");
		this.iframe.addEventListener("load", this.showcaseLoader.bind(this), true);
		window["DRAW_PATH"] = this.drawPath.bind(this);
		window["TEST"] = this.test.bind(this);
	}

	async showcaseLoader() {
		let self = this;
		// setTimeout(async () => {
		console.clear();
		try {
			let showcase = document.querySelector<HTMLIFrameElement>("#map");
			self.showcaseSize = {
				w: showcase.clientWidth,
				h: showcase.clientHeight,
			};

			let MP_SDK = showcase.contentWindow["MP_SDK"];

			self.SDK = await MP_SDK.connect(showcase, "e97a64c716ab413e8bc3009f714f1d0e", "3.8");
			window["MATTERPORT_SDK"] = self.SDK;

			self.SDK.Camera.pose.subscribe((pose) => {
				self.cameraPose = pose;
				// Changes to the Camera pose have occurred.
				// console.log("Current position is ", pose.position);
				// console.log("Rotation angle is ", pose.rotation);
				// console.log("Sweep UUID is ", pose.sweep);
				// console.log("View mode is ", pose.mode);
			});

			self.SDK.Sweep.data.subscribe({
				onAdded(index, item, collection) {
					console.log("sweep added to the collection", index, item, collection);
					self.sweeps = collection;
					window["SWEEPS"] = collection;
				},
				onRemoved(index, item, collection) {
					// console.log('sweep removed from the collection', index, item, collection);
					self.sweeps = collection;
					window["SWEEPS"] = collection;
				},
				onUpdated(index, item, collection) {
					// console.log('sweep updated in place in the collection', index, item, collection);
					self.sweeps = collection;
					window["SWEEPS"] = collection;
				},
				onCollectionUpdated(collection) {
					// console.log('the entire up-to-date collection', collection);
					self.sweeps = collection;
					// let sweeps = [];
					// for(let k in self.sweeps) {
					//   sweeps.push(self.sweeps[k])
					// }
					self.navigationTree = new NavigationTree(collection);
					window["SWEEPS"] = self.navigationTree;
				},
			});

			this.SDK.Mattertag.add({
				// label: "",
				// description: "",
				anchorPosition: { x: 0, y: 0, z: 0 },
				// stemVector: { x: 0, y: -1.5, z: 0, },
				stemVector: { x: 0, y: 0, z: 0 },
				color: { r: 1.0, g: 0.0, b: 0.0 },
				floorIndex: 0, // optional, if not specified the sdk will provide an estimate of the floor index for the anchor position provided.
			});

			this.test();
		} catch (e) {
			console.clear();
			console.log("CONNECT ERROR RESULT: ");
			console.error(e);
		}
		// }, 1000)
	}

	async test() {
		try {
			// await MatterportPath.register(this.SDK);

			// var initial = {
			// 	visible: true,
			// 	localPosition: { x: 1, y: 1, z: 1 },
			// 	localScale: { x: 1, y: 1, z: 1 },
			//   };
			// let node = await this.SDK.Scene.createNode();
			// var xr = node.addComponent(MatterportPath.NAME, initial);
			let node = await MatterportPath.addNode(this.SDK);
			node.start();
		} catch (error) {
			debugger;
		}
	}

	async drawPath() {
		// let _tags = await this.SDK.Mattertag.getData();
		// await this.SDK.Mattertag.remove(_tags.map((t) => t.sid));

		this.SDK.Mode.moveTo(this.SDK.Mode.Mode.FLOORPLAN);
		let nodes = this.navigationTree.getShortestWay("da46ac94cf0547488dfeafb6f2feb1d2", "418c8e3476c54359a4434879d2552b64");

		let points = nodes
			.map((n) => this.sweeps[n])
			.filter((s) => !!s)
			.map((s) => {
				s.position.y -= 1.5;
				return s.position;
			});
		let node = await MatterportPath.addNode(this.SDK, { points, color: Color.NAMES.white });
		node.start();

		// for (let i = 0; i < nodes.length; i++) {
		// 	let node = nodes[i];
		// 	let coordinate = this.sweeps[node].position;
		// 	coordinate.y -= 1.5;

		// 	var screenCoordinate = this.SDK.Conversion.worldToScreen(coordinate, this.cameraPose, this.showcaseSize);
		// 	console.log("TAG " + node, screenCoordinate);
		// 	let tags = await this.SDK.Mattertag.add({
		// 		// label: "",
		// 		// description: "",
		// 		anchorPosition: coordinate,
		// 		// stemVector: { x: 0, y: -1.5, z: 0, },
		// 		stemVector: { x: 0, y: 0, z: 0 },
		// 		color: { r: 0.0, g: 0.0, b: 1.0 },
		// 		floorIndex: 0, // optional, if not specified the sdk will provide an estimate of the floor index for the anchor position provided.
		// 	});

		// 	await this.SDK.Mattertag.preventAction(tags[0], { navigation: true, opening: true });

		// }
	}
}
