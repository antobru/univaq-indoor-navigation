import { Component, Input, NgZone, OnInit } from "@angular/core";
import { createAnimation } from "@ionic/angular";
import { ArtWork } from "src/app/models/artwork.model";

@Component({
	selector: "artwork-details",
	templateUrl: "./artwork-details.component.html",
	styleUrls: ["./artwork-details.component.scss"],
})
export class ArtworkDetailsComponent implements OnInit {
	@Input("artwork") artwork: ArtWork;

	constructor(private ngZone: NgZone) {}

	ngOnInit() {}

	setArtwork(artwork: ArtWork) {
		this.artwork = artwork;
		this.ngZone.run(() => {});
	}

	open(duration: number = 500) {
		duration = duration || 500;
		let element = document.getElementById("details");
		let animation = createAnimation();
		animation.addElement(element);
		animation.duration(duration);
		animation.beforeStyles({ display: "block" });
		animation.fromTo("transform", `translateX(100%)`, `translateX(0)`);
		return animation.play();
	}

	close(duration: number = 500) {
		duration = duration || 500;
		let element = document.getElementById("details");
		let animation = createAnimation();
		animation.addElement(element);
		animation.duration(duration);
		animation.fromTo("transform", `translateX(0)`, `translateX(100%)`);
		animation.afterStyles({ display: "none" });
		return animation.play();
	}

	getMediaType(media) {
		if (!media) {
			return "none";
		}

		if (media.mime.indexOf("image/") > -1) {
			return "image";
		}

		if (media.mime.indexOf("video/") > -1) {
			return "video";
		}
	}
}
