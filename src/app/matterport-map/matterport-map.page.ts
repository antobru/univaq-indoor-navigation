import { Component, OnInit, ViewChild } from "@angular/core";
import { NavigationTree } from "../core/navigation-tree";
import { Remarkable } from "remarkable";
import { MatterportPath } from "../core/matterport/matterport-path";
import { Color } from "three";
import { ArtworksCommandsComponent } from "../components/artworks-commands/artworks-commands.component";
import { ArtWork } from "../models/artwork.model";
import { ArtworksService } from "../services/artworks.service";
import { ArtworkDetailsComponent } from "../components/artwork-details/artwork-details.component";
import { Global } from "../services/global";

//declare var MP_SDK: any;

const md = new Remarkable();

@Component({
	selector: "app-matterport-map",
	templateUrl: "./matterport-map.page.html",
	styleUrls: ["./matterport-map.page.scss"],
})
export class MatterportMapPage implements OnInit {
	@ViewChild("ac") ac: ArtworksCommandsComponent;
	@ViewChild("ad", { static: false }) ad: ArtworkDetailsComponent;

	public iframe: HTMLElement;
	public SDK: any;
	public navigationTree: NavigationTree;
	public sweeps: any;
	public selectedTag: string;
	public tags: any[] = [];
	public showcaseSize: { w: any; h: any };
	public cameraPose: any;
	public artWorks: ArtWork[] = [];
	public selectedArtwork: ArtWork;

	constructor(private artworksService: ArtworksService) {}

	async ngOnInit() {
		this.artWorks = (await this.artworksService.find({})).map((a) => {
			if (a.image) {
				a.image.url = Global.ENDPOINTS.BASE + a.image.url;
			}
			for(let media of a.attachments) {
				media.url = Global.ENDPOINTS.BASE + media.url;
			}
			return a;
		});
		this.iframe = document.getElementById("map");
		this.iframe.addEventListener("load", this.showcaseLoader.bind(this), true);
		window["DRAW_PATH"] = this.drawPath.bind(this);
	}

	async showcaseLoader() {
		let self = this;
		// setTimeout(async () => {
		// console.clear();
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
					self.sweeps = collection;
					window["SWEEPS"] = collection;
				},
				onRemoved(index, item, collection) {
					self.sweeps = collection;
					window["SWEEPS"] = collection;
				},
				onUpdated(index, item, collection) {
					self.sweeps = collection;
					window["SWEEPS"] = collection;
				},
				onCollectionUpdated(collection) {
					self.sweeps = collection;
					self.navigationTree = new NavigationTree(collection);
					window["SWEEPS"] = self.navigationTree;
				},
			});

			self.SDK.on("tag.click", (id) => {
				console.log("TAG CLICKED: ", id);
				setTimeout(() => {
					this.mattertagClick(id);
				}, 600);
			});

			self.SDK.on("sweep.exit", (ev) => {
				this.ac.hide(true);
				this.ad.close(1);
			});

			self.SDK.Mattertag.data.subscribe({
				onAdded: function (index, item, collection) {
					// console.log("Mattertag added to the collection", index, item, collection);
				},
				onRemoved: function (index, item, collection) {
					// console.log("Mattertag removed from the collection", index, item, collection);
				},
				onUpdated: function (index, item, collection) {
					// console.log("Mattertag updated in place in the collection", index, item, collection);
				},
			});
			let _tags = await this.SDK.Mattertag.getData();
			await this.SDK.Mattertag.remove(_tags.map((t) => t.sid));

			for (let artwork of this.artWorks) {
				artwork.mattertag_info.label = artwork.title;
				artwork.description = '<div style="color: white">' + md.render(artwork.description) + "</div>";
				this.SDK.Mattertag.add(artwork.mattertag_info).then((res) => {
					artwork.mattertag_id = res[0];
					// console.clear();
					// console.log(res);
					self.SDK.Mattertag.injectHTML(res[0], artwork.description, {
						size: { w: "100%", h: 50 },
					});
					this.SDK.Mattertag.preventAction(res[0], { navigation: true, opening: true });
				});
			}

			this.tags = await this.SDK.Mattertag.getData();
			// console.clear();
			// console.log(this.tags);

			this.SDK.Mattertag.add({
				// label: "",
				// description: "",
				anchorPosition: { x: 0, y: 0, z: 0 },
				// stemVector: { x: 0, y: -1.5, z: 0, },
				stemVector: { x: 0, y: 0, z: 0 },
				color: { r: 1.0, g: 0.0, b: 0.0 },
				floorIndex: 0, // optional, if not specified the sdk will provide an estimate of the floor index for the anchor position provided.
			});
		} catch (e) {
			// console.clear();
			// console.log("CONNECT ERROR RESULT: ");
			// console.error(e);
		}
		// }, 1000)
	}

	mattertagClick(id) {
		this.selectedTag = id;
		this.selectedArtwork = this.artWorks.find((a) => a.mattertag_id == id);
		if (this.selectedArtwork) {
			this.ad.setArtwork(this.selectedArtwork);
			this.ad.open();
		}
		this.ac.show();
	}

	async drawPath() {
		// let _tags = await this.SDK.Mattertag.getData();
		// await this.SDK.Mattertag.remove(_tags.map((t) => t.sid));

		this.SDK.Mode.moveTo(this.SDK.Mode.Mode.FLOORPLAN);
		let nodes = this.navigationTree.getShortestWay("da46ac94cf0547488dfeafb6f2feb1d2", "ba7f7eecc89a4273a2ef6028a2064b1c"); //"418c8e3476c54359a4434879d2552b64");
		console.log(this.navigationTree.getShortestWayBetweenPoints("da46ac94cf0547488dfeafb6f2feb1d2", ["418c8e3476c54359a4434879d2552b64", "ba7f7eecc89a4273a2ef6028a2064b1c"]));

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
