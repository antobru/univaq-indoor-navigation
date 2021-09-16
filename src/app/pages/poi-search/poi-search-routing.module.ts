import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoiSearchPage } from './poi-search.page';

const routes: Routes = [
  {
    path: '',
    component: PoiSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoiSearchPageRoutingModule {}
