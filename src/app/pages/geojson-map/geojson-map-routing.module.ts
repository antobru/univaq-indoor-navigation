import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeojsonMapPage } from './geojson-map.page';

const routes: Routes = [
  {
    path: '',
    component: GeojsonMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeojsonMapPageRoutingModule {}
