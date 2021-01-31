import { Dijkstra, NodeVertex, Vertex } from "./dijkstra";

export class NavigationTree {

    private dijkstra: Dijkstra

    private sweeps: any;

    public nodes: any[] = [];
    public _edges: { start: string, end: string, weight: number }[] = []
    public edges: any = {};

    constructor(sweeps: any) {
        this.sweeps = sweeps;
        this.createTree();
    }

    createTree() {
        this.dijkstra = new Dijkstra();

        for (let k in this.sweeps) {
            
            let nodes = [];

            this.nodes.push(this.sweeps[k]);
            for (let neighbor of this.sweeps[k].neighbors) {
                let start = this.sweeps[k].position;
                let end = this.sweeps[neighbor].position;
                let distance = Math.sqrt(Math.pow((start.x + end.x), 2) + Math.pow((start.z + end.z), 2))
                this._edges.push({ start: k, end: neighbor, weight: distance });
                if(!this.edges[k]) {
                    this.edges[k] = {};
                }
                this.edges[k][neighbor] = distance;

                
                let nodeVertex = new NodeVertex();
                nodeVertex.nameOfVertex = neighbor;
                nodeVertex.weight = distance;
                nodes.push(nodeVertex)
            }

            this.dijkstra.addVertex(new Vertex(k, nodes, 1));
        }
    }

    getShortestWay(start: string, end: string) {
        return this.dijkstra.findShortestWay(start, end);
    }
}