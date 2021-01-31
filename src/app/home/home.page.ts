import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { Platform } from '@ionic/angular';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { Beacon } from '../models/beacon.model';
import * as uuid from 'uuid';
// import { MatterportService } from '../services/matterport.service';

declare var evothings;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public devices: Beacon[] = [];
  public n_scan: number = 0;
  public scanning_time: number = 5;
  public scanning_after_time: number = 6;
  public N: number = 3.3;


  constructor(public ble: BLE, public ibeacon: IBeacon, 
    public plt: Platform, public ngZone: NgZone,
    // public matterport: MatterportService
    ) {

    this.plt.ready().then((readySource) => {

      // console.log(this.matterport.getPosition());

      //this.eddystoneScan();
      // this.scanBeacon();
      console.log('Platform ready from', readySource);
      // alert('fghj')
      this.scanDevices();
      setInterval(() => {
        this.scanDevices();
      }, this.scanning_after_time * 1000);

    });
  }

  scanDevices() {
    this.n_scan++;
    this.ble.scan([], this.scanning_time)
      .subscribe(async (res: Beacon) => {
        if (res.name != 'iBKS105') return;
        let device = this.devices.find(d => d.id == res.id);
        if (!device) {
          device = new Beacon(res);
          this.devices.push(device);
        }
 
        if (res.advertising) {
          try {
            device.parsed_advertising = await this.parseFrameURL({}, res.advertising);
          } catch(error) {
            console.log(error);
          }
          // window.a = device.parsed_advertising;
          // window.b = this.bytesToHex(device.advertising).match(/.{1,2}/g);
        }
        device.rssi = res.rssi;
        device.data.url = this.bytesToString(res.advertising.slice(14, 29));
        device.tx = this.bytesToString(res.advertising.slice(10, 12));
        (device as any).a2 = this.bytesToHex(res.advertising.slice(11, 12));  //String.fromCharCode(...new Uint8Array(res.advertising)).toString();
        // device.distance = Math.pow(10, (-90 - device.rssi) / (10 * this.N));
        device.distance = this.calculateAccuracy(4, device.rssi)
        console.log(device.parsed_advertising);

        this.ngZone.run(() => { });
        //console.log("Lenght of parsed string: " + device.parsed_advertising.length);
      }, err => {
        console.log(err)
      });
  }

  bytesToString(buffer) {
    let convertData = String.fromCharCode.apply(null, new Uint8Array(buffer));
    return convertData;
  }

  bytesToHex(buffer: ArrayBuffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

  async scanBeacon() {
    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();

    delegate.didDetermineStateForRegion().subscribe(res => {
      console.log("State for region", res);
    })


    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
      .subscribe(
        data => {
          debugger;
          console.log('didRangeBeaconsInRegion: ', data)
        },
        error => {
          debugger;
          console.error()
        }
      );
    delegate.didStartMonitoringForRegion()
      .subscribe(
        data => {
          debugger;
          console.log('didStartMonitoringForRegion: ', data)
        },
        error => {
          debugger
          console.error(error)
        }
      );
    delegate.didEnterRegion()
      .subscribe(
        data => {
          debugger;
          console.log('didEnterRegion: ', data);
        }
      );

    let beaconRegion = this.ibeacon.BeaconRegion('deskBeacon', uuid.v4());

    this.ibeacon.startAdvertising(beaconRegion);

    this.ibeacon.startMonitoringForRegion(beaconRegion)
      .then(
        (res) => {
          debugger;
          console.log('Native layer received the request to monitoring');
        },
        error => {
          debugger;
          console.error('Native layer failed to begin monitoring: ', error);
        }
      );

  }

  parseFrameURL(device, data) {
    return new Promise((resolve, reject) => {
      if (data[0] != 0x10) return false;

      if (data.byteLength < 4) {
        reject("URL frame: invalid byteLength: " + data.byteLength);
        return true;
      }

      device.txPower = evothings.util.littleEndianToInt8(data, 1);

      // URL scheme prefix
      var url;
      switch (data[2]) {
        case 0: url = 'http://www.'; break;
        case 1: url = 'https://www.'; break;
        case 2: url = 'http://'; break;
        case 3: url = 'https://'; break;
        default: reject("URL frame: invalid prefix: " + data[2]); return true;
      }

      // Process each byte in sequence.
      var i = 3;
      while (i < data.byteLength) {
        var c = data[i];
        // A byte is either a top-domain shortcut, or a printable ascii character.
        if (c < 14) {
          switch (c) {
            case 0: url += '.com/'; break;
            case 1: url += '.org/'; break;
            case 2: url += '.edu/'; break;
            case 3: url += '.net/'; break;
            case 4: url += '.info/'; break;
            case 5: url += '.biz/'; break;
            case 6: url += '.gov/'; break;
            case 7: url += '.com'; break;
            case 8: url += '.org'; break;
            case 9: url += '.edu'; break;
            case 10: url += '.net'; break;
            case 11: url += '.info'; break;
            case 12: url += '.biz'; break;
            case 13: url += '.gov'; break;
          }
        }
        else if (c < 32 || c >= 127) {
          // Unprintables are not allowed.
          reject("URL frame: invalid character: " + data[2]);
          return true;
        }
        else {
          url += String.fromCharCode(c);
        }

        i += 1;
      }

      // Set URL field of the device.
      device.url = url;

      resolve(device);

      return true;
    })

  }

  eddystoneScan() {
    alert();
    debugger;
    evothings.eddystone.startScan((device) => {
      debugger;
      console.log(device);
    }, error => {
      debugger;
      console.log(error)
    })
  }

  calculateAccuracy(txPower, rssi) {
    if (!rssi || rssi >= 0 || !txPower) {
      return null
    }

    // Algorithm
    // http://developer.radiusnetworks.com/2014/12/04/fundamentals-of-beacon-ranging.html
    // http://stackoverflow.com/questions/21338031/radius-networks-ibeacon-ranging-fluctuation

    // The beacon distance formula uses txPower at 1 meters, but the Eddystone
    // protocol reports the value at 0 meters. 41dBm is the signal loss that
    // occurs over 1 meter, so we subtract that from the reported txPower.
    var ratio = rssi * 1.0 / (txPower - 41)
    if (ratio < 1.0) {
      return Math.pow(ratio, 10)
    }
    else {
      var accuracy = (0.89976) * Math.pow(ratio, 7.7095) + 0.111
      return accuracy
    }
  }

}
