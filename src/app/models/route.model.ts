import { ArtWork } from "./artwork.model";

export class Route {
    public id: string;
    public name: string;
    public arteworks: ArtWork[] = []
}