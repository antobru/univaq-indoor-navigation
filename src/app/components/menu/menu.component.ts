import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { createAnimation } from "@ionic/angular";
import { ArtWork } from "src/app/models/artwork.model";
import { RoutesService } from "../../services/routes.service";
import { ArtworksService } from "../../services/artworks.service";
import { Route } from "../../models/route.model";

@Component({
	selector: "menu",
	templateUrl: "./menu.component.html",
	styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
	public menuItemSelected: string;
	@Input('artworks') artworks: ArtWork[] = [];
	@Input('routes') routes: Route[] = [];
  @Output("artworkClick") artworkClick: EventEmitter<any> = new EventEmitter<any>();


	private commands = {
		Artworks: {
			open: this.openArtwors.bind(this),
			close: this.closeArtwors.bind(this),
		},
		Routes: {
			open: this.openRoutes.bind(this),
			close: this.closeRoutes.bind(this),
		},
	};

	constructor(private artworksService: ArtworksService, private routesService: RoutesService) {}

	async ngOnInit() {
    this.routes = await this.routesService.find({});
  }

	async toggleMenuItem(item: string) {
    let duration = 300;
		if (this.menuItemSelected == item) {
			this.commands[item].close(duration);
			this.menuItemSelected = null;
			return;
		}
		if (this.menuItemSelected) {
     // duration /= 2;
      await this.commands[this.menuItemSelected].close(duration);
    }
		this.menuItemSelected = item;
		await this.commands[item].open(duration);
	}

	openArtwors(duration: number = 500) {
    duration = duration || 500;
		let element = document.getElementById("artwork-list");
		let animation = createAnimation();
		animation.addElement(element);
		animation.duration(duration);
		animation.fromTo("transform", `translateX(-${element.clientWidth}px)`, `translateX(0)`);
		return animation.play();
	}

	closeArtwors(duration: number = 500) {
    duration = duration || 500;
		let element = document.getElementById("artwork-list");
		let animation = createAnimation();
		animation.addElement(element);
		animation.duration(duration);
		animation.fromTo("transform", `translateX(0)`, `translateX(-${element.clientWidth + 65}px)`);
		return animation.play();
	}

	openRoutes(duration: number = 500) {
    duration = duration || 500;
		let element = document.getElementById("routes-list");
		let animation = createAnimation();
		animation.addElement(element);
		animation.duration(duration);
		animation.fromTo("transform", `translateX(-${element.clientWidth + 65}px)`, `translateX(0)`);
		return animation.play();
	}

	closeRoutes(duration: number = 500) {
    duration = duration || 500;
		let element = document.getElementById("routes-list");
		let animation = createAnimation();
		animation.addElement(element);
		animation.duration(duration);
		animation.fromTo("transform", `translateX(0)`, `translateX(-${element.clientWidth + 65}px)`);
		return animation.play();
	}

  artWorkClickFn($event) {
    this.artworkClick.emit($event)
  }
}
