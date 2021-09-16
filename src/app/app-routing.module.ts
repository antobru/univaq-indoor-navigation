import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'poi-search',
    pathMatch: 'full'
  },
  {
    path: 'matterport-map',
    loadChildren: () => import('./pages/matterport-map/matterport-map.module').then( m => m.MatterportMapPageModule)
  },
  {
    path: 'artworks',
    loadChildren: () => import('./pages/artworks/artworks.module').then( m => m.ArtworksPageModule)
  },
  {
    path: 'geojson-map',
    loadChildren: () => import('./pages/geojson-map/geojson-map.module').then( m => m.GeojsonMapPageModule)
  },
  {
    path: 'geojson-map/:lat/:lng/:zoom',
    loadChildren: () => import('./pages/geojson-map/geojson-map.module').then( m => m.GeojsonMapPageModule)
  },
  {
    path: 'geojson-map/:poi_id',
    loadChildren: () => import('./pages/geojson-map/geojson-map.module').then( m => m.GeojsonMapPageModule)
  },
  {
    path: 'poi-search',
    loadChildren: () => import('./pages/poi-search/poi-search.module').then( m => m.PoiSearchPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
