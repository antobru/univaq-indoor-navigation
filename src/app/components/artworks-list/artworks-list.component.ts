import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ArtWork } from "src/app/models/artwork.model";
import { ArtworksService } from "../../services/artworks.service";

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

	constructor(private artworksService: ArtworksService) {}

	async ngOnInit() {
		// this.arteworks = await this.artworksService.find({});
		this._artworks = this.arteworks;
	}

	async search() {
		// this.arteworks = await this.artworksService.find({});
		this._artworks = this.arteworks.filter((a) => a.title.indexOf(this.searchTerm || ""));
	}

	gotoTag(artwork: ArtWork) {
		let SDK = window["MATTERPORT_SDK"];
		SDK.Mattertag.navigateToTag(artwork.mattertag_id, SDK.Mattertag.Transition.FLY);
		this.artworkClick.emit(artwork);
	}
}
