import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PointOfInterest } from 'src/app/models/point-of-interest.model';

@Component({
  selector: 'app-poi-search',
  templateUrl: './poi-search.page.html',
  styleUrls: ['./poi-search.page.scss'],
})
export class PoiSearchPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  goToMap(poi?: PointOfInterest) {
    if (poi) {
      // this.navCtrl.navigateForward(`/geojson-map/${poi.coordinate?.lat}/${poi.coordinate?.lng}/21`);
      this.navCtrl.navigateForward(`/geojson-map/${poi.id}`);
      return;
    }
    this.navCtrl.navigateForward(`/geojson-map`);
  }

}
