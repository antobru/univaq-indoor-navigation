import { Component, OnInit } from '@angular/core';
import { ArtWork } from 'src/app/models/artwork.model';
import { PointOfInterest } from 'src/app/models/point-of-interest.model';
import { ArtworksService } from 'src/app/services/artworks.service';
import { CacheDataService } from 'src/app/services/cache-data.service';
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
    this.pois = await this.poisService.find({},0, 1000);
  }

  async search() {
    this.pois = await this.poisService.find({},0, 1000, null, this.term);
  }

}
