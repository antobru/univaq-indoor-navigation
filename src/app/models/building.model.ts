import { Coordinate } from "./coordinate";
import { Floor } from "./floor.model";

export class Building {
    public id: any;
    public name: string;
    public zoom: number;
    public minZoom: number;
    public maxZoom: number;
    public center: Coordinate;
    public geojson: any;
    public floors: Floor[];

}