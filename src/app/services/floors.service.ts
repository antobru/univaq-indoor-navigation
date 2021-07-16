import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Floor } from '../models/floor.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class FloorsService extends CRUDService<Floor> {

  constructor(protected http: HttpClient) {
    super(http, `${Global.ENDPOINTS.BASE}/floors`);
  }

}
