class Dijkstra2D {
	private nodes: string[] = ["a", "b", "c", "d", "e"];
	private edges: { [key: string]: { [key: string]: number } } = {
		a: { b: 1, d: 10 },
		b: { a: 1, c: 1 },
		c: { b: 1, d: 1 },
		d: { c: 1, e: 1 },
		e: { d: 1 },
	};

	private Q: Queue = new Queue();
	private distances: { [key: string]: number[] } = {};
	getPath(start: string, end: string, mustVisitNodes: string[]) {
		for (let n of this.nodes) {
			this.distances[n] = [];
			this.distances[n][0] = Number.MAX_VALUE;
		}

		console.log("Create Start node");
		this.Q.push(this.createNode(start, 0, 0));
		//distanza[nodo][bitmask] = cost
		this.distances[start][0] = 0;
		console.log("Set start node: ", start, 0, 0);

		console.log("Start WHILE");
		while (!this.Q.empty()) {
			console.log("Execute WHILE...");

			let u = this.Q.getNodeWithLowestCost();
			console.log("Lowest cost node: ", u);

			if (u.cost != this.distances[u.node][u.bitmask]) {
				console.log("Cost different! continue... ");
				continue;
			}
			console.log("Get neighbors of " + u.node + ":");
			for (let v of this.neighbors(u.node)) {
				console.log("- " + v);

				let newBitmask = u.bitmask;
				console.log(`-- Set bitmask: `, newBitmask);
				console.log(`-- mustVisitNodes.indexOf("${v}") > -1 => `, mustVisitNodes.indexOf(v) > -1);
				if (mustVisitNodes.indexOf(v) > -1) {
					let vid = mustVisitNodes.indexOf(v); //this.mustVisitNodes.getId(v);
					newBitmask = u.bitmask | (1 << vid);
					console.log(`-- New bitmask: `, newBitmask);
				}
				let newCost = u.cost + this.edgeCost(u.node, v);
				console.log("-- Calculate new cost: " + newCost);
				console.log(`-- newCost < this.distances["${v}"][${newBitmask}]: ` + newCost + " < " + (this.distances[v][newBitmask] || 'INFINITY') + " => ", newCost < (this.distances[v][newBitmask] || Number.MAX_VALUE));
				if (newCost < (this.distances[v][newBitmask] || Number.MAX_VALUE)) {
					console.log("-- New cost < other distance");

					this.distances[v][newBitmask] = newCost;
					this.Q.push(this.createNode(v, newBitmask, newCost));
				}
			}
		}
		console.log('')
		console.log('')
		console.log('this.distances[end][(1 << (mustVisitNodes.length + 1)) - 1]')
		console.log(`- this.distances[${end}][(1 << (${mustVisitNodes.length} + 1)) - 1]`)
		console.log(`-- this.distances[${end}][${(1 << (mustVisitNodes.length + 1))} - 1]`)
		console.log(`--- this.distances[${end}][${(1 << (mustVisitNodes.length + 1)) - 1}]`)
		console.log(`---> ${this.distances[end][(1 << (mustVisitNodes.length + 1)) - 1]}`)
		return this.distances[end][(1 << (mustVisitNodes.length + 1)) - 1];
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

class Queue {
	data: DijkstraNode[] = [];

	empty() {
		return !this.data.length;
	}

	push(data: DijkstraNode) {
		this.data.push(data);
	}

	getNodeWithLowestCost(): DijkstraNode {
		let min: DijkstraNode;

		for (let d of this.data) {
			if (!min || d.cost < min.cost) min = d;
		}

		this.data = this.data.filter((d) => d.node != min.node);

		return min;
	}
}

class DijkstraNode {
	public node: string;
	public bitmask: number;
	public cost: number;

	constructor(node, bitmask, cost) {
		this.node = node;
		this.bitmask = bitmask;
		this.cost = cost;
	}
}

console.log(new Dijkstra2D().getPath("a", "e", ["d"]));
