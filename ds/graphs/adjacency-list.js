/**
 * Undirected Graph using Adjacency List
 */
class Graph {
    constructor() {
        this.adjacencyList = {}
    }

    /**
     * Add a new vertex. This vertex will have 0 edge in the beginning
     */
    addVertex(vertex) {
        if (vertex in this.adjacencyList) return false
        this.adjacencyList[vertex] = []
        return true
    }

    /**
     * Add edge between 2 vertices
     * This works only if both vertices exists
     */
    addEdge(v1, v2) {
        // Both vertex exists
        if (this.adjacencyList[v1] && this.adjacencyList[v2]) {
            if (!this.adjacencyList[v1].includes(v2)) this.adjacencyList[v1].push(v2)
            if (!this.adjacencyList[v2].includes(v1)) this.adjacencyList[v2].push(v1)
            return true
        }
        return false
    }

    /**
     * Remove Edge between vertices v1 & v2
     */
    removeEdge(v1, v2) {
        if (this.adjacencyList[v1]) {
            this.adjacencyList[v1] = this.adjacencyList[v1].filter(v => v !== v2)
        }

        if (this.adjacencyList[v2]) {
            this.adjacencyList[v2] = this.adjacencyList[v2].filter(v => v !== v1)
        }
    }

    /**
     * Remove Vertex v
     * - Ensure all Edges to vertex v are also removed
     * - Which means removing v entry from other vertices list
     */
    removeVertex(v) {
        // 1st remove edges of vertex v with other vertices
        for (let vertex of this.adjacencyList[v]) {
            this.removeEdge(v, vertex)
        }

        // Remove vertex as well
        delete this.adjacencyList[v]
    }
}

const g = new Graph()
g.addVertex('tokio')
g.addVertex('hongkong')
g.addVertex('dallas')
g.addVertex('aspen')

g.addEdge('tokio', 'dallas')
g.addEdge('dallas', 'aspen')
g.addEdge('dallas', 'aspen')
g.addEdge('tokio', 'aspen')
g.addEdge('hongkong', 'tokio')
g.addEdge('hongkong', 'dallas')

console.log(g)

g.removeEdge('d', 't')
g.removeEdge('tokio', 'aspen')

console.log(g)

g.removeVertex('hongkong')

console.log(g)
