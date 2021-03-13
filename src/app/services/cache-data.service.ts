import { Injectable } from "@angular/core";
import { ArtWork } from "../models/artwork.model";
import { Route } from "../models/route.model";

@Injectable({
	providedIn: "root",
})
export class CacheDataService {
	static mode: "session" | "local" = "local";

	public favorites: string[] = [];
	public cache: Storage = CacheDataService.mode == "local" ? localStorage : sessionStorage;
	public artworks: ArtWork[] = [];
	public routes: Route[] = [];

	constructor() {
		this.routes = JSON.parse(this.cache.getItem("routes") || "[]");
		this.favorites = JSON.parse(this.cache.getItem("favorites") || "[]");
		this.routes.push(...[{ name: "Il Bronzino", id: "BRONZX", artworks: ["WUbPQjezb1s", "DOmC5VTkpUU", "nieBTbXGUhQ", "s7i6OopsEwC", "MJr0XAXx3dd", "xNFawztkiGi"] }]);
	}

	addArtwork(artwork: ArtWork) {
		artwork.isFavorite = this.favorites.indexOf(artwork.id) > -1;
		this.artworks.push(artwork);
	}

	toggleFavorite(artwork: ArtWork) {
		if (this.favorites.indexOf(artwork.id) == -1) {
			this.favorites.push(artwork.id);
		} else {
			this.favorites = this.favorites.filter((f) => f != artwork.id);
		}
		this.cache.setItem("favorites", JSON.stringify(this.favorites));
	}

	addRoute(route: Route) {
		debugger;
		route.id = "route- " + Date.now();
		route.fk_user = "sadasd";
		this.routes.push(route);
		this.cache.setItem("routes", JSON.stringify(this.routes));
	}

	addArtworkToRoute(route: Route, artwork: ArtWork) {
		route = this.routes.find((r) => r.id == route.id);
		route.artworks.push(artwork.mattertag_id);
		route.artworks = Array.from(new Set(route.artworks));
		this.cache.setItem("routes", JSON.stringify(this.routes));
	}

	removeRoute(route: Route) {
		this.routes = this.routes.filter((r) => r.id != route.id);
		this.cache.setItem("routes", JSON.stringify(this.routes));
	}
}
