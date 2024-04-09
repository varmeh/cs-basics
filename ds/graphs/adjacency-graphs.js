/**
 * Weighted Graphs using Adjacency Maps
 *
 * Adjancency Maps takes best of Adjacency Lists & Matrix
 * - Space complexity for graph with vertices v & edges u is O(v+u) -- Like list
 *  - In matrix, space complexity is O(v^2) & thus are not inefficient for sparse graph
 * - Time Complexity for Edge Search between vertices u & v is O(1) -- same as matrix
 *
 * - Most real world use-cases rally with adjanceny lists / maps
 *  - Use list only, when every byte counts & it's a sparse graph
 *  - Else use Adjacency Maps
 */

class WeightedGraphs {
    constructor() {
        this.adjacencyMaps = {}
    }

    /**
     * Add a new vertex. This vertex will have 0 edge in the beginning
     */
    addVertex(vertex) {
        if (!this.adjacencyMaps[vertex]) this.adjacencyMaps[vertex] = {}
    }

    /**
     * Add edge between 2 vertices
     * This works only if both vertices exists
     */
    addEdge(v1, v2, weight) {
        // Both vertex exists
        if (this.adjacencyMaps[v1] && this.adjacencyMaps[v2]) {
            if (!this.adjacencyMaps[v1][v2]) this.adjacencyMaps[v1][v2] = weight
            if (!this.adjacencyMaps[v2][v1]) this.adjacencyMaps[v2][v1] = weight
            return true
        }
        return false
    }
}

const g = new WeightedGraphs()

g.addVertex('A')
g.addVertex('B')
g.addVertex('C')
g.addVertex('D')
g.addVertex('E')
g.addVertex('F')

g.addEdge('A', 'B', 4)
g.addEdge('A', 'C', 2)
g.addEdge('C', 'D', 2)
g.addEdge('B', 'E', 3)
g.addEdge('D', 'E', 3)
g.addEdge('D', 'F', 1)
g.addEdge('E', 'F', 1)
g.addEdge('C', 'F', 4)

console.log(g)
