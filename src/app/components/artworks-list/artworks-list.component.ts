import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ArtWork } from "src/app/models/artwork.model";
import { CacheDataService } from "src/app/services/cache-data.service";
import { ArtworksService } from "../../services/artworks.service";
import { AddArtworkInRouteComponent } from "../add-artwork-in-route/add-artwork-in-route.component";

@Component({
	selector: "artworks-list",
	templateUrl: "./artworks-list.component.html",
	styleUrls: ["./artworks-list.component.scss"],
})
export class ArtworksListComponent implements OnInit {
	@Input("arteworks") arteworks: ArtWork[] = [];
	public _artworks: ArtWork[] = [];
	@Output("artworkClick") artworkClick: EventEmitter<any> = new EventEmitter<any>();
	public searchTerm: string;

	public filter = {
		favorites: false,
		suggested: false,
	};

	constructor(private artworksService: ArtworksService, private modalCtrl: ModalController, private cacheData: CacheDataService) {}

	async ngOnInit() {
		// this.arteworks = await this.artworksService.find({});
		this._artworks = this.arteworks;
	}

	async search() {
		// this.arteworks = await this.artworksService.find({});
		this._artworks = this.arteworks.filter((a) => (a.title || "").toLowerCase().indexOf((this.searchTerm || "").toLowerCase()) > -1);
	}

	async gotoTag(artwork: ArtWork) {
		let SDK = window["MATTERPORT_SDK"];
		await SDK.Mattertag.navigateToTag(artwork.mattertag_id, SDK.Mattertag.Transition.FLY);
		this.artworkClick.emit(artwork);
	}

	prefered() {
		if (this.filter.favorites) {
			this.filter.favorites = false;
			this._artworks = this.arteworks;
			return;
		}
		this._artworks = this.arteworks.filter((a) => a.isFavorite);
		this.filter.favorites = true;
	}

	toogleFavorite(artwork: ArtWork) {
		artwork.isFavorite = !artwork.isFavorite;
		this.cacheData.toggleFavorite(artwork);
	}

	async addToRoute(artwork: ArtWork) {
		let modal = await this.modalCtrl.create({
			component: AddArtworkInRouteComponent,
			componentProps: {
				artwork: artwork,
			},
		});

		modal.present();

		modal.onDidDismiss().then((res) => {});
	}
}
