import { Area } from "./area.model";
import { Coordinate } from "./coordinate";

export class Beacon {
    public id: any;
    public uuid: string;
    public note: string;
    public coordinate: Coordinate;
    public area: Area;
}