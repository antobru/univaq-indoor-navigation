import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PointOfInterest } from '../models/point-of-interest.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class PoisService extends CRUDService<PointOfInterest> {

  constructor(protected http: HttpClient) {
    super(http, `${Global.ENDPOINTS.BASE}/points-of-interests`);
  }

}
