import { Component, Input, OnInit } from "@angular/core";
import { createAnimation } from "@ionic/angular";
import { ArtWork } from "../../models/artwork.model";

@Component({
	selector: "artworks-commands",
	templateUrl: "./artworks-commands.component.html",
	styleUrls: ["./artworks-commands.component.scss"],
})
export class ArtworksCommandsComponent implements OnInit {
	@Input("artwork") artwork: ArtWork;
	@Input("mattertag_id") mattertag_id: string;

	constructor() {}

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
}
