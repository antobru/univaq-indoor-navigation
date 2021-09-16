import { Component, NgZone, OnInit } from '@angular/core';
import mapStyle from '../../../assets/map-style.json';
import { Beacon } from '../../models/beacon';
import { BeaconsService } from '../../services/beacons.service';
import { BuildingsService } from '../../services/buildings.service';
import { FloorsService } from '../../services/floors.service';
import { Global } from '../../services/global';
import { Area } from '../../models/area.model';
import { AreasService } from '../../services/areas.service';
import { PoisService } from 'src/app/services/pois.service';
import { PointOfInterest } from 'src/app/models/point-of-interest.model';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { BeaconFormComponent } from 'src/app/components/beacon-form/beacon-form.component';
import { Coordinate } from 'src/app/models/coordinate';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-geojson-map',
  templateUrl: './geojson-map.page.html',
  styleUrls: ['./geojson-map.page.scss'],
})
export class GeojsonMapPage implements OnInit {

  map: any;
  mapClickListener: any;
  options: any;
  styles = mapStyle;
  currentPosition: { lat: number, lng: number };
  showCurrentPosition: boolean = false;

  detectedBeacons: any[] = [];
  allBeacons: any[] = [];
  beaconsMapping: Beacon[] = [];
  showBeacons: boolean = false;
  showMapping: boolean = false;
  showAllbeacons: boolean = false;

  private _areas: Area[] = [];
  areas: Area[] = [];

  pois: PointOfInterest[] = [];
  showPois: boolean = true;
  view: boolean;
  currentInfoWindow: any;

  constructor(
    private buildingsService: BuildingsService,
    private floorsService: FloorsService,
    public beaconsService: BeaconsService,
    public areasService: AreasService,
    public poisService: PoisService,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    // this.map = JSON.parse(JSON.stringify(this._map));
    const params = this.route.snapshot.params;
    const building = await this.buildingsService.findOne(1);
    this.options = {
      lat: parseFloat(params.lat || building.center.lat),
      lng: parseFloat(params.lng || building.center.lng),
      zoom: parseFloat(params.zoom || building.zoom),
      minZoom: building.minZoom,
      maxZoom: building.maxZoom
    }
    this.map = await this.buildingsService.getMedia(`${Global.ENDPOINTS.BASE}${building.geojson.url}`);
    const floor = await this.floorsService.findOne(1);
    this._areas = floor.areas;
    this.areas = this._areas.filter((a: any) => a.active);
    this.beaconsMapping = await this.beaconsService.find({}, 0, 1000);
    this.pois = await this.poisService.find({}, 0, 1000);

    if (params.poi_id) {
      const poi = this.pois.find(p => p.id == params.poi_id);
      setTimeout(() => {
        this.poiClick(poi);
      }, 300)
    }
  }

  alertInfo(area: Area) {
    alert(`[${area.id}]  ${area.name}`);
  }

  public mapReadyHandler(map: google.maps.Map): void {
    this.mapClickListener = map.addListener('click', (e: google.maps.MouseEvent) => {
      this.ngZone.run(() => {
        const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        console.log(JSON.stringify(coords));
        this.openOptions(coords);
      });
    });
  }

  public ngOnDestroy(): void {
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }

  checkArea(position) {
    if (!position) {
      this.areas = [];
      return;
    }
    this.areas = this._areas.filter(a => this.isInside(position, a.paths));
  }

  isInside(position: { lat: number, lng: number }, paths: { lat: number, lng: number }[]) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    const x = position.lat;
    const y = position.lng;

    let inside = false;
    for (let i = 0, j = paths.length - 1; i < paths.length; j = i++) {
      const xi = paths[i].lat;
      const yi = paths[i].lng;
      const xj = paths[j].lat;
      const yj = paths[j].lng;

      let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  };

  async startDetection() {
    // this.beaconsService.all = !this.beaconsService.all;
    const obs = await this.beaconsService.startDetect();
    obs.subscribe(detectedBeacons => {
      this.allBeacons = detectedBeacons;
      this.detectedBeacons = detectedBeacons.map(r => {
        let beacon = this.beaconsMapping.find(b => b.uuid == r.id);
        r.coordinate = beacon ? beacon.coordinate : null;
        return r;
      }).filter(b => b.coordinate).sort((a, b) => a.distance - b.distance);
      if (this.detectedBeacons.length > 2) {
        // detectedBeacons = detectedBeacons.sort((a, b) => a.distance - b.distance).slice(0, 3);
        try {
          const position: any = this.beaconsService.calcPosition(detectedBeacons);
          this.currentPosition = { lat: position.lat, lng: position.lng };
          this.checkArea(this.currentPosition);
        } catch (error) {
          console.log(error);
        }
      }
      this.ngZone.run(() => { });
    });
  }

  async stopDetection() {
    await this.beaconsService.stopDetect();
  }
  async toggleDetection() {
    if (this.beaconsService.isMonitoring) {
      this.beaconsService.isMonitoring = !this.beaconsService.isMonitoring;
      return await this.stopDetection();
    }
    this.beaconsService.isMonitoring = !this.beaconsService.isMonitoring;
    return await this.startDetection();
  }

  toggleAreas() {
    this.ngZone.run(() => {
      this.showMapping = !this.showMapping;

      if (!this.showMapping) {
        this.checkArea(this.currentPosition)
        return;
      }
      this.areas = this._areas;
    })

  }

  async openOptions(coordinate: Coordinate) {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        { text: 'Aggiungi beacon', handler: () => { this.mapBeacon(coordinate) } }
      ]
    });
    actionSheet.present();
  }

  async mapBeacon(coordinate: Coordinate) {
    const modal = await this.modalCtrl.create({
      component: BeaconFormComponent,
      componentProps: { coordinate }
    });
    modal.present();
    modal.onDidDismiss().then(async res => {
      if (res.data) {
        await this.beaconsService.create(res.data);
        this.beaconsMapping = await this.beaconsService.find({}, 0, 1000);
      }
    })
  }

  beaconIcon(beacon) {
    return this.detectedBeacons.find(db => db.id == beacon.uuid) ? 'assets/bluetooth-active.png' : 'assets/bluetooth.png'
  }

  goFavorites() {

  }

  poiClick(poi: PointOfInterest) {
    this.currentInfoWindow = null;
    this.options.lat = poi.coordinate.lat;
    this.options.lng = poi.coordinate.lng;
    setTimeout(() => {
      this.currentInfoWindow = poi.id;
    }, 300)
  }
}
