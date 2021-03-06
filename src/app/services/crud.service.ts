import { HttpClient } from "@angular/common/http";
import * as qs from "qs";

export class CRUDService<T> {
	public endpoint: string;

	constructor(protected http: HttpClient, endpoint: string) {
		this.http = http;
		this.endpoint = endpoint;
	}

	find(filter: any, start: number = 0, limit: number = 20, sort: string = null, q: string = ''): Promise<T[]> {
		let params: any = {};
		let _where = '';
		if (filter) _where = qs.stringify(filter);
		if (start) params._start = "" + (start || 0);
		if (limit) params._limit = "" + (limit || 20);
		if (sort) params._sort = "" + (limit || 20);
		if (q) params._q = q;

		return this.http
			.get<T[]>(`${this.endpoint}?${_where ? '_where=' + _where : ''}`, { params })
			.toPromise();
	}

	findOne(id: any) {
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

	getMedia(url: string) {
		return this.http.get(url).toPromise();
	}
}
