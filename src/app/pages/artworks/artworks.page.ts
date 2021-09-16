import { Component, OnInit } from '@angular/core';
import { ArtWork } from 'src/app/models/artwork.model';
import { PointOfInterest } from 'src/app/models/point-of-interest.model';
import { ArtworksService } from 'src/app/services/artworks.service';
import { CacheDataService } from 'src/app/services/cache-data.service';
import { Global } from 'src/app/services/global';
import { PoisService } from 'src/app/services/pois.service';

@Component({
  selector: 'app-artworks',
  templateUrl: './artworks.page.html',
  styleUrls: ['./artworks.page.scss'],
})
export class ArtworksPage implements OnInit {

  // public artworks: ArtWork[];
  public pois: PointOfInterest[];
  public term: string = '';

  constructor(private poisService: PoisService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    // this.artworks = await this.cacheData.artworks;
    let pois = await this.poisService.find({}, 0, 1000);
    this.pois = pois.map(p => {
      if (p.cover) {
        p.cover.url = `${Global.ENDPOINTS.BASE}${p.cover.url}`;
      }
      return p;
    });
  }

  async search() {
    this.pois = await this.poisService.find({}, 0, 1000, null, this.term);
  }

}
