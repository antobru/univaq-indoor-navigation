import { GeometryUtils } from "../utils/geometry.utils";

export class Dijkstra2D {
	private nodes: string[] = [];
	// ["s", "a", "b", "c", "d", "e", "f", "h", "g"];
	private edges: { [key: string]: { [key: string]: number } } = {};
	// {
	// 	s: { a: 10, b: 6, c: 2 },
	// 	a: { d: 7, s: 10 },
	// 	b: { e: 3, s: 6 },
	// 	c: { e: 5, s: 2 },
	// 	d: { a: 7, f: 5, g: 6, e: 2 },
	// 	e: { c: 5, b: 3, d: 2, g: 4, h: 12 },
	// 	f: { d: 5, g: 3 },
	// 	h: { e: 12, g: 5 },
	// 	g: { f: 3, d: 6, e: 4, h: 5 }
	// };

	private Q: Queue = new Queue();
	private distances: { [key: string]: { weight: number; path: string[] }[] } = {};

	constructor(sweeps: any) {
		this.createTree(sweeps);
	}

	createTree(sweeps: any) {
		for (let k in sweeps) {
			this.nodes.push(k);
			this.edges[k] = {};
			for (let neighbor of sweeps[k].neighbors) {
				let start = sweeps[k].position;
				let end = sweeps[neighbor].position;
				let distance = GeometryUtils.distaceBetweenTwoPoints({ x: start.x, y: start.z }, { x: end.x, y: end.z });
				this.edges[k][neighbor] = distance;
			}
		}
	}

	getPath(start: string, end: string, mustVisitNodes: string[]) {
		
		for (let n of this.nodes) {
			this.distances[n] = [];
		}

		this.Q.push(this.createNode(start, 0, 0), []);
		this.distances[start][0] = { weight: 0, path: [] };
		this.distances[start][0].path.push(start);

		while (!this.Q.empty()) {
			let u = this.Q.getNodeWithLowestCost();

			if (u.node.cost != this.distances[u.node.labelNode][u.node.bitmask].weight) {
				continue;
			}

			for (let v of this.neighbors(u.node.labelNode)) {
				let newBitmask = u.node.bitmask;

				if (mustVisitNodes.indexOf(v) > -1) {
					let vid = mustVisitNodes.indexOf(v);
					newBitmask = u.node.bitmask | (1 << vid);
				}
				let newCost = u.node.cost + this.edgeCost(u.node.labelNode, v);

				if (!this.distances[v][newBitmask]) this.distances[v][newBitmask] = { weight: Number.MAX_VALUE, path: [] };

				if (newCost < this.distances[v][newBitmask].weight) {
					let newPath: string[] = u.path.concat([u.node.labelNode]);

					this.distances[v][newBitmask].weight = newCost;
					this.distances[v][newBitmask].path = newPath;
					this.Q.push(this.createNode(v, newBitmask, newCost), newPath);
				}
			}
		}
		this.distances[end][(1 << mustVisitNodes.length) - 1].path.push(end);
		return this.distances[end][(1 << mustVisitNodes.length) - 1];
	}

	edgeCost(start, end) {
		let cost = this.edges[start][end] || Number.MAX_VALUE;
		return cost;
	}

	neighbors(node: string): string[] {
		return Object.keys(this.edges[node]);
	}

	createNode(node, bitmask, cost) {
		let n: DijkstraNode = new DijkstraNode(node, bitmask, cost);
		return n;
	}
}

export class Queue {
	data: { node: DijkstraNode; path: string[] }[] = [];

	empty() {
		return !this.data.length;
	}

	push(node: DijkstraNode, path: string[]) {
		this.data.push({ node, path });
	}

	getNodeWithLowestCost(): { node: DijkstraNode; path: string[] } {
		let min: DijkstraNode;

		for (let d of this.data) {
			if (!min || d.node.cost < min.cost) min = d.node;
		}

		let res = this.data.find((d) => d.node.labelNode == min.labelNode);
		this.data = this.data.filter((d) => d.node.labelNode != min.labelNode);

		return res;
	}
}

export class DijkstraNode {
	public labelNode: string;
	public bitmask: number;
	public cost: number;

	constructor(labelNode, bitmask, cost) {
		this.labelNode = labelNode;
		this.bitmask = bitmask;
		this.cost = cost;
	}
}
