import { Component, OnInit } from '@angular/core';
import { ArtWork } from 'src/app/models/artwork.model';
import { ArtworksService } from 'src/app/services/artworks.service';
import { CacheDataService } from 'src/app/services/cache-data.service';

@Component({
  selector: 'app-artworks',
  templateUrl: './artworks.page.html',
  styleUrls: ['./artworks.page.scss'],
})
export class ArtworksPage implements OnInit {

  public artworks: ArtWork[];

  constructor(private artworksService: ArtworksService, private cacheData: CacheDataService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.artworks = await this.cacheData.artworks;
  }

}
