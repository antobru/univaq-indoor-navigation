import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatterportMapPage } from './matterport-map.page';

const routes: Routes = [
  {
    path: '',
    component: MatterportMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatterportMapPageRoutingModule {}
