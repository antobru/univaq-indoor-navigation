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

const components = [ArtworksCommandsComponent, MenuComponent, RoutessListComponent, ArtworksListComponent, ArtworkDetailsComponent];

@NgModule({
	declarations: components,
	imports: [IonicModule, CommonModule, FormsModule, PinchZoomModule],
	exports: components,
})
export class ComponentsModule {}
