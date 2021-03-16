import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ArtWork } from 'src/app/models/artwork.model';
import { Route } from 'src/app/models/route.model';
import { CacheDataService } from 'src/app/services/cache-data.service';

@Component({
  selector: 'app-add-artwork-in-route',
  templateUrl: './add-artwork-in-route.component.html',
  styleUrls: ['./add-artwork-in-route.component.scss'],
})
export class AddArtworkInRouteComponent implements OnInit {

  @Input('artwork') artwork: ArtWork;
  public routes: Route[] = [];
  public selectedRoute: Route;
  public newRoute: boolean;

  constructor(private cacheData: CacheDataService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.selectedRoute = this.cacheData.routes.find(r => r.id == sessionStorage.getItem('last_route'))
    this.routes = this.cacheData.routes.filter(r => !!r.fk_user);
  }

  addRoute() {
    this.newRoute = true;
    this.selectedRoute = new Route();
    this.selectedRoute.artworks = this.artwork? [this.artwork.mattertag_id] : [];
  }

  back() {
    this.newRoute = false;
    this.selectedRoute = null
  }

  save() {
    if (this.selectedRoute) {
      sessionStorage.setItem('last_route', this.selectedRoute.id);
      if (this.newRoute) {
        this.cacheData.addRoute(this.selectedRoute);
        this.modalCtrl.dismiss();
        return; 
      }
  
      this.cacheData.addArtworkToRoute(this.selectedRoute, this.artwork);
      this.modalCtrl.dismiss();
      
    }
  }

}
