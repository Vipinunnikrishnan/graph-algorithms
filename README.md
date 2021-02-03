# graph-algorithms

## Bellman-Form Algorithm

- Single source shortest path algorithm
  -- Given a graph and a source vertex to find shortest path from the source to other vertices
- Dynamic programming strategy
- Repeatedly relax all edges |v| - 1 (n-1) times.
- Formula -- dist[v] = Math.min(dist[u] + cost[u,v], dist[v])
