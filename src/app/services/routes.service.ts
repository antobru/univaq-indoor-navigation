import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Route } from "../models/route.model";
import { CRUDService } from "./crud.service";
import { Global } from "./global";

@Injectable({
	providedIn: "root",
})
export class RoutesService extends CRUDService<Route> {
	constructor(protected http: HttpClient) {
		super(http, `${Global.ENDPOINTS.BASE}/routes`);
	}
}
