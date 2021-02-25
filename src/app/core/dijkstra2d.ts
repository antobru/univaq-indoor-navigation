// export class Dijkstra2D {
// 	private start: string;
// 	private end: string;
// 	private mustVisitNodes: string[];

// 	private Q: Queue = new Queue();
// 	private distances: { [key: string]: number } = {};
// 	getPath() {
// 		this.Q.push(this.createNode(this.start, 0, 0));
// 		this.distances[this.start] = 0;

// 		while (!this.Q.empty()) {
// 			let u = this.Q.getNodeWithLowestCost();
// 			if (u.cost != this.distances[u.node][u.bitmask]) {
// 				continue;
// 			}
// 			for (let v of this.neighbors(u.node)) {
// 				let newBitmask = u.bitmask;
// 				if (this.mustVisitNodes.indexOf(v) > -1) {
// 					let vid = this.mustVisitNodes.getid(v);
// 					newBitmask = u.bitmask | (1 << vid);
// 				}
// 				let newCost = u.cost + this.edgeCost(u.node, v);
// 				if (newCost < this.distances[v][newBitmask]) {
// 					this.distances[v][newBitmask] = newCost;
// 					this.Q.push(this.createNode(v, newBitmask, newCost));
// 				}
// 			}
// 		}
// 		return this.distances[this.end][(1 << (this.mustVisitNodes.length + 1)) - 1];
// 	}

// 	edgeCost(start, end) {
// 		// todo: implement
// 		return 0;
// 	}

// 	neighbors(node: string): string[] {
// 		// todo: implement
// 		return [];
// 	}

// 	createNode(node, x, y) {
// 		// todo: implement
// 	}
// }

// export class Queue {
// 	data: any[] = [];

// 	empty() {
// 		return !this.data.length;
// 	}

// 	push(data) {
// 		this.data.push(data);
// 	}

// 	getNodeWithLowestCost(): { cost: number; node: string; bitmask: number } {
// 		// todo: implement
// 		return null;
// 	}
// }
