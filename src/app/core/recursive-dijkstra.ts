import { Dijkstra, Vertex } from "./dijkstra";

export class RecursiveDijkstra {
	private dijkstra: Dijkstra = new Dijkstra();

	private info = {};

	constructor(dijkstra: Dijkstra) {
		this.dijkstra = dijkstra;
	}

	start(startNode: string, nodes: string[], info = null) {
		info = info || this.info;
		for (let node of nodes) {
			let key = startNode + "_" + node;
			info[key] = {};
			let result = this.dijkstra.findShortestWayWithWeight(startNode, node);
			info[key].path = result.path;
			info[key].weight = result.weight;
			info[key].nodes = {};
			let _nodes = nodes.filter((n) => n != node);
			this.start(node, _nodes, info[key].nodes);
		}
		return info;
	}
}
