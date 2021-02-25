import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CRUDService } from "./crud.service";
import { ArtWork } from "../models/artwork.model";
import { Global } from "./global";

@Injectable({
	providedIn: "root",
})
export class ArtworksService extends CRUDService<ArtWork> {
	constructor(protected http: HttpClient) {
		super(http, `${Global.ENDPOINTS.BASE}/artworks`);
	}
}
