import { ArtWork } from "./artwork.model";

export class Route {
    public id: string;
    public name: string;
    public artworks: string[] = [];
    public fk_user?: string;
}