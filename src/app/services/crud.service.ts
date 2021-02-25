import { HttpClient } from "@angular/common/http";
import * as qs from "qs";

export class CRUDService<T> {
	public endpoint: string;

	constructor(protected http: HttpClient, endpoint: string) {
		this.http = http;
		this.endpoint = endpoint;
	}

	find(filter: any, start: number = 0, limit: number = 20, sort: string = null): Promise<T[]> {
		let params: any = {};
		if (filter) params._where = qs.stringify(filter);
		if (start) params._start = "" + (start || 0);
		if (limit) params._limit = "" + (limit || 20);
		if (sort) params._sort = "" + (limit || 20);

		return this.http
			.get<T[]>(`${this.endpoint}`, { params })
			.toPromise();
	}

	findOne(id: string) {
		return this.http.get<T>(`${this.endpoint}/${id}`).toPromise();
	}

	create(entity: T): Promise<T> {
		return this.http.post<T>(`${this.endpoint}`, entity).toPromise();
	}

	update(entity: T) {
		return this.http.put<T>(`${this.endpoint}`, entity).toPromise();
	}

	delete(id: string) {
		return this.http.delete<T>(`${this.endpoint}/${id}`).toPromise();
	}
}
