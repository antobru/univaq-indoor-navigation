import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { GeojsonMapPageRoutingModule } from './geojson-map-routing.module';

import { GeojsonMapPage } from './geojson-map.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeojsonMapPageRoutingModule,
    LeafletModule,
    AgmCoreModule
  ],
  declarations: [GeojsonMapPage]
})
export class GeojsonMapPageModule {}
