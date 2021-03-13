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
import { CacheDataService } from "../services/cache-data.service";
import { Dijkstra2D } from "../core/dijkstra2d";
import { GeometryUtils } from "../utils/geometry.utils";

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

	constructor(private artworksService: ArtworksService, private cacheData: CacheDataService) {}

	async ngOnInit() {
		// this.artWorks = (await this.artworksService.find({})).map((a) => {
		// 	if (a.image) {
		// 		a.image.url = Global.ENDPOINTS.BASE + a.image.url;
		// 	}
		// 	for (let media of a.attachments) {
		// 		media.url = Global.ENDPOINTS.BASE + media.url;
		// 	}
		// 	return a;
		// });
		this.artWorks = [];
		this.iframe = document.getElementById("map");
		this.iframe.addEventListener("load", this.showcaseLoader.bind(this), true);
	}

	async showcaseLoader() {
		let self = this;
		try {
			let showcase = document.querySelector<HTMLIFrameElement>("#map");
			self.showcaseSize = { w: showcase.clientWidth, h: showcase.clientHeight };

			let MP_SDK = showcase.contentWindow["MP_SDK"];
			self.SDK = await MP_SDK.connect(showcase, "e97a64c716ab413e8bc3009f714f1d0e", "3.8");
			window["MATTERPORT_SDK"] = self.SDK;

			self.SDK.Camera.pose.subscribe((pose) => (self.cameraPose = pose));

			self.SDK.Sweep.data.subscribe({
				onAdded(index, item, collection) {
					self.sweeps = collection;
					window["__SWEEPS"] = collection;
				},
				onRemoved(index, item, collection) {
					self.sweeps = collection;
					window["__SWEEPS"] = collection;
				},
				onUpdated(index, item, collection) {
					self.sweeps = collection;
					window["__SWEEPS"] = collection;
				},
				onCollectionUpdated(collection) {
					self.sweeps = collection;
					self.navigationTree = new NavigationTree(collection);
					window["__NAVIGATION_TREE"] = self.navigationTree;
					window["__SWEEPS"] = collection;
				},
			});

			self.SDK.on("tag.click", (id) => {
				console.log("TAG CLICKED: ", id);
				setTimeout(() => {
					this.mattertagClick(id);
				}, 600);
			});

			self.SDK.on("sweep.exit", (ev) => {
				console.log(ev);
				this.ac.hide(true);
				this.ad.close(1);
			});

			self.SDK.Mattertag.data.subscribe({
				onAdded(index, item, collection) {
					let exclude = `b:0.7647058823529411-g:0.7215686274509804-r:0.6705882352941176`;
					if (item.label && `b:${item.color.b}-g:${item.color.g}-r:${item.color.r}` != exclude) {
						let artwork: any = { mattertag_id: item.sid, title: item.label, description: item.description, id: item.sid };
						self.artWorks.push(artwork);
						self.cacheData.addArtwork(artwork);
					}
					console.log("Mattertag added to the collection", index, item, collection);
				},
			});

			for (let artwork of this.artWorks) {
				artwork.mattertag_info.label = artwork.title;
				artwork.description = '<div style="color: white">' + md.render(artwork.description) + "</div>";
			}

			this.tags = await this.SDK.Mattertag.getData();
			for (let tag of this.tags) {
				console.log('')
				console.log(this.tags.length)
				console.log('')
				tag.nearestSweep = await this.nearestSweep(tag);
			}
			window["__TAGS"] = this.tags;
			//await this.SDK.Mattertag.remove(this.tags.map((t) => t.sid));

			this.SDK.Mattertag.add({
				// label: "",
				// description: "",
				anchorPosition: { x: 0, y: 0, z: 0 },
				// stemVector: { x: 0, y: -1.5, z: 0, },
				stemVector: { x: 0, y: 0, z: 0 },
				color: { r: 1.0, g: 0.0, b: 0.0 },
				floorIndex: 0, // optional, if not specified the sdk will provide an estimate of the floor index for the anchor position provided.
			});

			// setTimeout(async () => {
			// 	for (let key in window["__SWEEPS"]) {
			// 		let sweep = window["__SWEEPS"][key];
			// 		await this.SDK.Mattertag.add({
			// 			label: sweep.uuid,
			// 			// description: "",
			// 			anchorPosition: sweep.position,
			// 			stemVector: { x: 0, y: -1.5, z: 0 },
			// 			//stemVector: { x: 0, y: 0, z: 0 },
			// 			color: { r: 1.0, g: 0.0, b: 0.0 },
			// 		});
			// 	}
			// }, 5000);
		} catch (e) {}
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

	async nearestSweep(tag) {
		let sweeps = window["__SWEEPS"];
		let nearestSweep = { distance: Number.MAX_VALUE, sweep_id: "", sweep: null };
		for (let key in sweeps) {
			let sweep = sweeps[key];
			let distance = GeometryUtils.distaceBetweenTwoPoints({ x: tag.anchorPosition.x, y: tag.anchorPosition.z }, { x: sweep.position.x, y: sweep.position.z });
			if (nearestSweep.distance > distance) {
				nearestSweep.distance = distance;
				nearestSweep.sweep_id = sweep.uuid;
				nearestSweep.sweep = sweep;
			}
		}

		return nearestSweep;
	}
}
