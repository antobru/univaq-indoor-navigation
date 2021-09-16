import { Area } from "./area.model";
import { Coordinate } from "./coordinate";

export class PointOfInterest {
    public id: any;
    public name: string;
    public description: string;
    public cover: any;
    public attachments: any[];
    public metadata: any;
    public area: Area;
    public coordinate: Coordinate;
}