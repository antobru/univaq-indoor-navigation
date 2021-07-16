import { Component, NgZone, OnInit } from '@angular/core';
import mapStyle from '../../../assets/map-style.json';
import { Beacon } from '../../models/beacon.model';
import { BeaconsService } from '../../services/beacons.service';
import { BuildingsService } from '../../services/buildings.service';
import { FloorsService } from '../../services/floors.service';
import { Global } from '../../services/global';
import { Area } from '../../models/area.model';
import { AreasService } from '../../services/areas.service';

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

  detectedBeacons: any[] = [];
  beaconsMapping: Beacon[] = [];
  showBeacons: boolean = false;
  showMapping: boolean = false;

  private _areas: Area[] = [];
  areas: Area[] = [];

  constructor(
    private buildingsService: BuildingsService, private floorsService: FloorsService,
    public beaconsService: BeaconsService,
    public areasService: AreasService,
    private ngZone: NgZone
  ) { }

  async ngOnInit() {
    // this.map = JSON.parse(JSON.stringify(this._map));
    const building = await this.buildingsService.findOne(1);
    this.options = {
      lat: building.center.lat,
      lng: building.center.lng,
      zoom: building.zoom,
      minZoom: building.minZoom,
      maxZoom: building.maxZoom
    }
    this.map = await this.buildingsService.getMedia(`${Global.ENDPOINTS.BASE}${building.geojson.url}`);
    const floor = await this.floorsService.findOne(1);
    this._areas = floor.areas;
    this.areas = this._areas.filter((a: any) => a.active);
    this.beaconsMapping = await this.beaconsService.find({});
  }

  alertInfo(area: Area) {
    alert(`[${area.id}]  ${area.name}`);
  }

  public mapReadyHandler(map: google.maps.Map): void {
    this.mapClickListener = map.addListener('click', (e: google.maps.MouseEvent) => {
      this.ngZone.run(() => {
        const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        console.log(JSON.stringify(coords));
      });
    });
  }

  public ngOnDestroy(): void {
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }

  checkArea(position) {
    if (!position) return;
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
    this.beaconsService.all = !this.beaconsService.all;
    const obs = await this.beaconsService.startDetect();
    obs.subscribe(res => {
      this.ngZone.run(() => {
        this.detectedBeacons = res.map(r => {
          let beacon = this.detectedBeacons.find(b => b.id == r.id);
          debugger
          r.coordinate = beacon ? beacon.coordinate : null;
          return r;
        }).filter(b => b.coordinate);
        if (this.detectedBeacons.length > 1) {
          const position: any = this.beaconsService.calcPosition(res);
          this.currentPosition = { lat: position.lat, lng: position.lng };
          console.log()
          this.checkArea(this.currentPosition);
        }
      })
    });
  }

  async stopDetection() {
    await this.beaconsService.stopDetect();
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

}
