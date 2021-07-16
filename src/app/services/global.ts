import { EventEmitter } from "@angular/core";

export class Global {
    static ENDPOINTS = {
        // BASE: "http://localhost:1337"
        BASE: "https://univaq-api.addo.app"
    }

    static ROUTE_PLAYING: EventEmitter<boolean> = new EventEmitter<boolean>();

}