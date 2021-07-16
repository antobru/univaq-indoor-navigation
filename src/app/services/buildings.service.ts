import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Building } from '../models/building.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class BuildingsService extends CRUDService<Building> {

  constructor(protected http: HttpClient) {
    super(http, `${Global.ENDPOINTS.BASE}/buildings`);
  }

}
