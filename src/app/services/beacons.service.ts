import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BeaconRegion, IBeacon, Beacon as iBeacon } from '@ionic-native/ibeacon/ngx';
import { Platform } from '@ionic/angular';
import locate from 'multilateration';
import { Observable } from 'rxjs';
import { Beacon } from '../models/beacon';
import { CRUDService } from './crud.service';
import { Global } from './global';

const N = 1;

@Injectable({
  providedIn: 'root'
})
export class BeaconsService extends CRUDService<Beacon> {

  UUID: string = 'e1f54e02-1e23-44e0-9c3d-512eb56adec8';
  all: boolean = true;
  beaconRegion: BeaconRegion;
  isMonitoring: boolean = false;

  constructor(private ibeacon: IBeacon, protected http: HttpClient, private platform: Platform) {
    super(http, `${Global.ENDPOINTS.BASE}/beacons`);
  }

  async startDetect(): Promise<Observable<Beacon[]>> {
    if (this.beaconRegion) {
      await this.stopDetect();
    }

    return new Observable((observer) => {
      // Request permission to use location on iOS
      this.ibeacon.requestAlwaysAuthorization();
      // create a new delegate and register it with the native layer
      let delegate = this.ibeacon.Delegate();

      // Subscribe to some of the delegate's event handlers
      delegate.didDetermineStateForRegion().subscribe(
        data => console.log('didDetermineStateForRegion: ', data),
        error => console.error(error)
      );
      delegate.didExitRegion().subscribe(
        data => console.log('didExitRegion: ', data),
        error => console.error(error)
      );
      delegate.monitoringDidFailForRegionWithError().subscribe(
        data => console.log('monitoringDidFailForRegionWithError: ', data),
        error => console.error(error)
      );
      delegate.peripheralManagerDidStartAdvertising().subscribe(
        data => console.log('peripheralManagerDidStartAdvertising: ', data),
        error => console.error(error)
      );
      delegate.peripheralManagerDidUpdateState().subscribe(
        data => console.log('peripheralManagerDidUpdateState: ', data),
        error => console.error(error)
      );
      delegate.didRangeBeaconsInRegion().subscribe(
        data => {
          console.log('didRangeBeaconsInRegion: ', data)
          const beacons = data.beacons;
          observer.next(beacons.map(b => ({
            id: b.uuid,
            accuracy: b.accuracy,
            distance: this.errorCorrection(b.accuracy, b.tx, b.rssi),
            rssi: b.rssi,
            tx: b.tx,
            coordinate: { lat: 0, lng: 0 }
          })));
        },
        error => console.error(error)
      );
      delegate.didStartMonitoringForRegion().subscribe(
        data => {
          console.log('didStartMonitoringForRegion: ', data)
        },
        error => console.error(error)
      );
      delegate.didEnterRegion().subscribe(
        data => {
          console.log('didEnterRegion: ', data);
        }
      );
      this.beaconRegion = this.ibeacon.BeaconRegion('deskBeacon', (window as any).cordova.plugins.locationManager.BeaconRegion.WILDCARD_UUID);

      this.ibeacon.startMonitoringForRegion(this.beaconRegion)
        .then(
          () => console.log('Native layer received the request to monitoring'),
          error => console.error('Native layer failed to begin monitoring: ', error)
        );

      this.ibeacon.startRangingBeaconsInRegion(this.beaconRegion).then(
        (data) => console.log('Ranging: ', data),
        error => console.error('Ranging error: ', error)
      );
    });
  }

  async stopDetect() {
    await this.ibeacon.stopMonitoringForRegion(this.beaconRegion);
    await this.ibeacon.stopRangingBeaconsInRegion(this.beaconRegion);
  }

  calcPosition(beacons: Beacon[]) {
    return locate(beacons.filter(b => b.coordinate && b.coordinate.lat && b.coordinate.lng)
      .map(b => ({
        distance: b.distance,
        lat: b.coordinate.lat,
        lng: b.coordinate.lng,
        z: b.coordinate.z
      })), { geometry: 'earth', method: 'lseInside' });
  }

  private errorCorrection(distance: number, tx: number, rssi: number) {
    return distance;
    // if (rssi == 0) {
    //   return -1.0; // if we cannot determine distance, return -1.
    // }

    // const ratio = rssi * 1.0 / tx;
    // if (ratio < 1.0) {
    //   return Math.pow(ratio, 10);
    // }
    // else {
    //   const accuracy = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
    //   return accuracy;
    // }
  }
}
