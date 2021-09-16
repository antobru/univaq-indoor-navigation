import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PointOfInterest } from 'src/app/models/point-of-interest.model';
import { Global } from 'src/app/services/global';
import { PoisService } from 'src/app/services/pois.service';

@Component({
  selector: 'poi-search',
  templateUrl: './poi-search.component.html',
  styleUrls: ['./poi-search.component.scss'],
})
export class PoiSearchComponent implements OnInit {

  @Input('pois') pois: PointOfInterest[] = [];
  @Input('options') options: { showRecents?: boolean, showAttachements?: boolean, search?: boolean } = {};
  public searchTerm: string;

  @Output("poiClick") poiClick: EventEmitter<PointOfInterest> = new EventEmitter();

  constructor(private poisService: PoisService) { }

  async ngOnInit() {
    let pois = await this.poisService.find({}, 0, 4);
    this.pois = pois.map(p => {
      if (p.cover) {
        p.cover.url = `${Global.ENDPOINTS.BASE}${p.cover.url}`;
      }
      return p;
    });
  }

  async search() {
    let pois = await this.poisService.find({ }, 0, 4, undefined, this.searchTerm);
    this.pois = pois.map(p => {
      if (p.cover) {
        p.cover.url = `${Global.ENDPOINTS.BASE}${p.cover.url}`;
      }
      return p;
    });
  }

  poiClickFn(poi: PointOfInterest) {
    this.poiClick.emit(poi);
  }

}
