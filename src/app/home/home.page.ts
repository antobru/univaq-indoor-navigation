import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { Beacon } from '../models/beacon';
import * as uuid from 'uuid';
import { PoisService } from '../services/pois.service';
import { PointOfInterest } from '../models/point-of-interest.model';
import { Global } from '../services/global';
// import { MatterportService } from '../services/matterport.service';

declare var evothings;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public pois: PointOfInterest[] = [];

  constructor() {
  }

  async ionViewWillEnter() {
    
  }

}
