import { Component, OnInit } from "@angular/core";
import { Dijkstra2D } from "src/app/core/dijkstra2d";
import { MatterportPath, MatterportPathInstance } from "src/app/core/matterport/matterport-path";
import { CacheDataService } from "src/app/services/cache-data.service";
import { Global } from "src/app/services/global";
import { GeometryUtils } from "src/app/utils/geometry.utils";
import { Color } from "three";
import { Route } from "../../models/route.model";

@Component({
	selector: "routes-list",
	templateUrl: "./routess-list.component.html",
	styleUrls: ["./routess-list.component.scss"],
})
export class RoutessListComponent implements OnInit {
	public routes: Route[] = [];
	public _routes: Route[] = [];
	public playing_route: string;
	public actualPath: MatterportPathInstance;
	private tags: any[] = [];
	searchTerm: string;

	public filter = {
		favorites: false,
		suggested: false,
	};

	constructor(private cacheData: CacheDataService) {}

	ngOnInit() {
		this.routes = this.cacheData.routes.sort((r1, r2) => (r1.fk_user == null ? -999 : 0) - (r2.fk_user == null ? -999 : 0));
		this._routes = this.routes;
	}

	async search() {
		// this.arteworks = await this.artworksService.find({});
		this._routes = this.routes.filter((a) => (a.name || "").toLowerCase().indexOf((this.searchTerm || "").toLowerCase()) > -1);
	}

	async play(route: Route) {
		let SDK = window["MATTERPORT_SDK"];
		let navigationTree = window["__NAVIGATION_TREE"];
		let dijkstra2d: Dijkstra2D = new Dijkstra2D(window["__SWEEPS"]);
		this.tags = await SDK.Mattertag.getData();

		let no_move = (await SDK.Camera.getPose()).mode == SDK.Mode.Mode.FLOORPLAN;
		if (this.playing_route != route.id) {
			await this.stop(true);
		}

		let filter_tags = this.tags.filter((t) => route.artworks.indexOf(t.sid) == -1).map((t) => t.sid);
		for (let ft of filter_tags) {
			SDK.Mattertag.editOpacity(ft, 0);
		}

		await SDK.Mode.moveTo(SDK.Mode.Mode.FLOORPLAN, { transition: no_move ? SDK.Mode.TransitionType.INSTANT : SDK.Mode.TransitionType.FLY });
		//let nodes = navigationTree.getShortestWay("da46ac94cf0547488dfeafb6f2feb1d2", "418c8e3476c54359a4434879d2552b64"); // "ba7f7eecc89a4273a2ef6028a2064b1c");

		let mustVisitSweeps = [];
		for (let id of route.artworks) {
			let tag = window["__TAGS"].find((t) => t.sid == id);
			mustVisitSweeps.push(tag.nearestSweep.sweep_id);
		}

		// TODO: re-enable algorithm
		// let result = dijkstra2d.getPath("da46ac94cf0547488dfeafb6f2feb1d2", "05f0334dbfb048adb1161852ca5f41b8", mustVisitSweeps);
		// console.log("Dijkstra2D result: ", result);

		// let points = result.path
		// 	.map((n) => navigationTree.sweeps[n])
		// 	.filter((s) => !!s)
		// 	.map((s) => {
		// 		s.position.y -= 1.5;
		// 		return s.position;
		// 	});

		// this.actualPath = await MatterportPath.addNode(SDK, { points, stroke: 0.1, color: Color.NAMES.white });
		// this.actualPath.start();
		this.playing_route = route.id;
		Global.ROUTE_PLAYING.emit(true);
	}

	async stop(no_move: boolean = false) {
		this.playing_route = null;
		let SDK = window["MATTERPORT_SDK"];
		let promises = [];
		for (let t of this.tags) {
			promises.push(SDK.Mattertag.editOpacity(t.sid, 1));
		}
		await SDK.Mode.moveTo(SDK.Mode.Mode.INSIDE, { transition: no_move ? SDK.Mode.TransitionType.INSTANT : SDK.Mode.TransitionType.FLY });
		if (this.actualPath) {
			this.actualPath.stop();
			this.actualPath = null;
		}
		Global.ROUTE_PLAYING.emit(false);
		return Promise.all(promises);
	}

	suggest() {
		if (this.filter.suggested) {
			this.filter.suggested = false;
			this._routes = this.routes;
			return;
		}
		this._routes = this.routes.filter((r) => !r.fk_user);
		this.filter.favorites = false;
		this.filter.suggested = true;
	}

	prefered() {
		if (this.filter.favorites) {
			this.filter.favorites = false;
			this._routes = this.routes;
			return;
		}
		this._routes = this.routes.filter((r) => r.fk_user);
		this.filter.favorites = true;
		this.filter.suggested = false;
	}
}
