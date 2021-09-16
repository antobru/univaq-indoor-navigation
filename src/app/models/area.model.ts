import { Beacon } from "./beacon";
import { Coordinate } from "./coordinate";

export class Area {
    public id: any;
    public name: string;
    public fill: string;
    public stroke: string;
    public paths: Coordinate[];
    public beacons: Beacon[];
}