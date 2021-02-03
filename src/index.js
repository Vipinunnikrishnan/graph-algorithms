class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(val, priority) {
    this.values.push({
      val,
      priority
    });
    this.values.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.values.shift();
  }
}

class WeightedGraph {
  constructor() {
    this.list = {};
    this.edges = [];
  }

  addVertex(v) {
    this.list[v] = [];
  }

  addEdge(v1, v2, weight) {
    this.list[v1].push({
      node: v2,
      w: weight
    });
    this.list[v2].push({
      node: v1,
      w: weight
    });

    this.edges.push({
      start: v1,
      end: v2,
      w: weight
    });
  }

  /*
    Single source shortest path. It wont work with -ve edge weights.
    Time Complexity = O[ELogV]
    Space Complexity - O(V)
  */
  dijkstra(start, end) {
    const nodes = new PriorityQueue();
    const dist = {};
    const prev = {};

    // Initialize dist map with Infinity except for the start vertex;
    // Also, add vertext into priority queue
    for (let v in this.list) {
      if (v === start) {
        dist[v] = 0;
        nodes.enqueue(v, 0);
      } else if (dist[v] !== 0) {
        dist[v] = Infinity;
        nodes.enqueue(v, Infinity);
      }

      prev[v] = null;
    }

    let smallest;
    const path = [];

    // Iterate over priority queue.
    while (nodes.values.length) {
      // Dequeue the vertex with smallest weight.
      smallest = nodes.dequeue().val;

      // if the smallest vertext is same as end, then
      if (smallest === end) {
        // Find the path and return;
        while (prev[smallest]) {
          path.push(smallest);
          smallest = prev[smallest];
        }

        break;
      }

      // if the smallest weight is not infinity, iterate over all edges.
      if (smallest || dist[smallest] !== Infinity) {
        for (let e of this.list[smallest]) {
          // calculate new distance to neibhouring node.

          // Apply the formula.
          let candidate = dist[smallest] + e.w;

          if (candidate < dist[e.node]) {
            // Update dist as well as parent maps.
            dist[e.node] = candidate;
            prev[e.node] = smallest;

            // Enqueue the new weight for the destination node to PQ.
            nodes.enqueue(e.node, candidate);
          }
        }
      }
    }

    document.getElementById("dijkstra").textContent = path
      .concat(start)
      .reverse();
  }

  /*
      Shortest path algorithm and works with -ve edge cycle. 
      Time Complexity - O(VE);
      Space Complexity - O(V)

  */
  bellmanFord(begin, finish) {
    const dist = {};
    const parent = {};
    parent[begin] = -1;

    // For all vetexes, set distance as Infinity except for the source vertex;
    for (let v in this.list) {
      if (v === begin) {
        dist[v] = 0;
      } else {
        dist[v] = Infinity;
      }
    }

    let updated = false;

    // If there are N venrtex in the graph, we need run the loop for N - 1 times (relaxing)
    // Each relaxation consider all edges and calculates its weight.
    for (let i = 0; i < Object.keys(this.list).length - 1; i++) {
      updated = false;
      for (let { start, end, w } of this.edges) {
        // if the destination weight is greather than source distrance + edge weight, update
        // the destiation weight.
        // also, set the parent.
        if (dist[end] > dist[start] + w) {
          dist[end] = dist[start] + w;
          parent[end] = start;
          updated = true;
        }
      }

      // if any cycle doesnt update the distance, break it.
      if (!updated) {
        break;
      }
    }

    if (updated) {
      document.getElementById("bellman").textContent =
        "detected -ve edge cycle";
      return;
    }

    const path = [];

    while (parent[finish]) {
      path.push(finish);
      finish = parent[finish];
    }

    document.getElementById("bellman").textContent = path.reverse();
  }

  /*
     All Pair shortest path algorithm. 
     Can find the shortest path weight between nodes. Not actually giving the path
     Time Complexity - O(V * 3)
     Space Complexity - O(v * 2);
  */
  floydWarshall(start, end) {
    let begin = start;
    let finish = end;
    const matrix = [];

    for (let i = 0; i < Object.keys(this.list).length; i++) {
      matrix[i] = new Array(Object.keys(this.list).length).fill(Infinity);

      matrix[i][i] = 0;
    }

    const parent = [];
    for (let { start, end, w } of this.edges) {
      matrix[start][end] = w;

      if (!parent[start]) parent[start] = [];

      parent[start][end] = end;
    }

    for (let i = 0; i < Object.keys(this.list).length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        for (let k = 0; k < matrix[i].length; k++) {
          if (j === i) continue;

          if (matrix[j][i] + matrix[i][k] < matrix[j][k]) {
            matrix[j][k] = Math.min(matrix[j][i] + matrix[i][k], matrix[j][k]);
            parent[j][k] = parent[j][i];
          }
        }
      }
    }

    const path = [];
    while (start !== end) {
      path.push(start);
      start = parent[start][end];
    }

    console.log(matrix);
    for (let i = 0; i < Object.keys(this.list).length; i++) {
      if (matrix[i][i] < 0)
        document.getElementById("FLOYD").textContent = "-ve edge cycle present";
    }

    document.getElementById("FLOYD").textContent = matrix[begin][finish];
  }
}

const graph = new WeightedGraph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addVertex("E");
graph.addVertex("F");

graph.addEdge("A", "B", 4);
graph.addEdge("A", "C", 2);
graph.addEdge("B", "E", 3);
graph.addEdge("C", "D", 2);
graph.addEdge("C", "F", 4);
graph.addEdge("D", "E", 3);
graph.addEdge("D", "F", 1);
graph.addEdge("E", "F", 1);

graph.dijkstra("A", "E");

const graph2 = new WeightedGraph();

graph2.addVertex("0");
graph2.addVertex("1");
graph2.addVertex("2");
graph2.addVertex("3");
graph2.addVertex("4");

graph2.addEdge("0", "1", 6);
graph2.addEdge("0", "2", 7);
graph2.addEdge("1", "2", 8);
graph2.addEdge("1", "3", -4);
graph2.addEdge("1", "4", 5);
graph2.addEdge("2", "4", -3);
graph2.addEdge("2", "3", 9);
graph2.addEdge("3", "0", 2);
graph2.addEdge("3", "4", 7);
graph2.addEdge("4", "1", -2);

graph2.bellmanFord("0", "4");

const graph3 = new WeightedGraph();

graph3.addVertex(0);
graph3.addVertex(1);
graph3.addVertex(2);
graph3.addVertex(3);

graph3.addEdge(0, 1, 9);
graph3.addEdge(0, 2, -4);
graph3.addEdge(1, 3, 2);
graph3.addEdge(1, 0, 6);
graph3.addEdge(2, 1, 5);
graph3.addEdge(3, 2, 1);

graph3.floydWarshall(0, 1);
