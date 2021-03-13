import { Component, Input, OnInit } from "@angular/core";
import { createAnimation, ModalController } from "@ionic/angular";
import { CacheDataService } from "src/app/services/cache-data.service";
import { ArtWork } from "../../models/artwork.model";
import { AddArtworkInRouteComponent } from "../add-artwork-in-route/add-artwork-in-route.component";

@Component({
	selector: "artworks-commands",
	templateUrl: "./artworks-commands.component.html",
	styleUrls: ["./artworks-commands.component.scss"],
})
export class ArtworksCommandsComponent implements OnInit {
	@Input("artwork") artwork: ArtWork;
	@Input("mattertag_id") mattertag_id: string;

	constructor(private modalCtrl: ModalController, private cacheData: CacheDataService) {}

	ngOnInit() {}

	show(duration: number = 500) {
		duration = isNaN(duration) ? duration : 500;
		let element = document.getElementById("artwork-commands");
		let animation = createAnimation();
		animation.addElement(element);
		animation.fromTo("transform", `translateX(${element.clientWidth}px)`, "translateX(0)");
		animation.duration(duration);
		animation.play();
	}

	hide(instant: boolean = false, duration: number = 500) {
		duration = instant ? 0 : isNaN(duration) ? duration : 500;
		let element = document.getElementById("artwork-commands");
		let animation = createAnimation();
		animation.addElement(element);
		animation.fromTo("transform", `translateX(0)`, `translateX(${element.clientWidth}px)`);
		animation.duration(duration);
		animation.play();
	}

	toogleFavorite() {
		this.artwork.isFavorite = !this.artwork.isFavorite;
		this.cacheData.toggleFavorite(this.artwork);
	}

	async addToRoute() {
		let modal = await this.modalCtrl.create({ 
			component: AddArtworkInRouteComponent,
			componentProps: {
				artwork: this.artwork
			}
		 });

		 modal.present();

		 modal.onDidDismiss().then(res => {
			 
		 })
	}
}
