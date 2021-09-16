import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArtworksCommandsComponent } from "./artworks-commands/artworks-commands.component";
import { IonicModule } from "@ionic/angular";
import { MenuComponent } from "./menu/menu.component";
import { RoutessListComponent } from "./routess-list/routess-list.component";
import { ArtworksListComponent } from "./artworks-list/artworks-list.component";
import { FormsModule } from "@angular/forms";
import { ArtworkDetailsComponent } from "./artwork-details/artwork-details.component";
import { PinchZoomModule } from "ngx-pinch-zoom";
import { AddArtworkInRouteComponent } from "./add-artwork-in-route/add-artwork-in-route.component";
import { BeaconFormComponent } from "./beacon-form/beacon-form.component";
import { PoiSearchComponent } from "./poi-search/poi-search.component";

const components = [
	ArtworksCommandsComponent, 
	MenuComponent, 
	RoutessListComponent, 
	ArtworksListComponent, ArtworkDetailsComponent, AddArtworkInRouteComponent,
	BeaconFormComponent,
	PoiSearchComponent
];

@NgModule({
	declarations: components,
	imports: [IonicModule, CommonModule, FormsModule, PinchZoomModule],
	exports: components,
})
export class ComponentsModule {}
