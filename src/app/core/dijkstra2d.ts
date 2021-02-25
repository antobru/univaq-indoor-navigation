export class Dijkstra2D {
	private start: string;
	private end: string;
	private mustVisitNodes: string[];

	private Q: Queue = new Queue();
	private distances: { [key: string]: number[] } = {};
	getPath() {
		this.Q.push(this.createNode(this.start, 0, 0));
        //distanza[nodo][bitmask] = cost
        this.distances[this.start][0] = 0

		while (!this.Q.empty()) {
			let u = this.Q.getNodeWithLowestCost();
			if (u.cost != this.distances[u.node][u.bitmask]) {
				continue;
			}
			for (let v of this.neighbors(u.node)) {
				let newBitmask = u.bitmask;
				if (this.mustVisitNodes.indexOf(v) > -1) {
					let vid = this.mustVisitNodes.getId(v);
					newBitmask = u.bitmask | (1 << vid);
				}
				let newCost = u.cost + this.edgeCost(u.node, v);
				if (newCost < this.distances[v][newBitmask]) {
					this.distances[v][newBitmask] = newCost;
					this.Q.push(this.createNode(v, newBitmask, newCost));
				}
			}
		}
		return this.distances[this.end][(1 << (this.mustVisitNodes.length + 1)) - 1];
	}

	edgeCost(start, end) {
		// todo: implement
		return 0;
	}

	neighbors(node: string): string[] {
		// todo: implement
		return [];
	}

	createNode(node, bitmask, cost) {
		 let n: Node = new Node(node, bitmask, cost);
         return n;
	}
}

export class Queue {
	data: Node[] = [];

	empty() {
		return !this.data.length;
	}

	push(data: Node) {
		this.data.push(data);
	}

	getNodeWithLowestCost(): Node {
		let min: Node;
        
        for(let d of this.data)
        {
            if(!min || d.cost < min.cost)
                min = d;
        }

		return min;
	}
}
export class Node {
    public node: string;
    public bitmask: number;
    public cost: number;

    constructor(node, bitmask, cost){
        this.node = node;
        this.bitmask = bitmask;
        this.cost = cost;
    }
}
