import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Area } from '../models/area.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class AreasService  extends CRUDService<Area> {

  constructor(protected http: HttpClient) {
    super(http, `${Global.ENDPOINTS.BASE}/areas`);
  }

}
