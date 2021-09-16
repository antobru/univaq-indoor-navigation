import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoiSearchPageRoutingModule } from './poi-search-routing.module';

import { PoiSearchPage } from './poi-search.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoiSearchPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PoiSearchPage]
})
export class PoiSearchPageModule {}
