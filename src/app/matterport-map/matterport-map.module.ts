import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatterportMapPageRoutingModule } from './matterport-map-routing.module';

import { MatterportMapPage } from './matterport-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatterportMapPageRoutingModule
  ],
  declarations: [MatterportMapPage]
})
export class MatterportMapPageModule {}
