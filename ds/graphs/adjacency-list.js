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

    /**
     * Performs a recursive depth-first search (DFS) starting from a given vertex.
     * This method explores as far as possible along each branch before backtracking.
     *
     * @param {string|number} v The starting vertex for the DFS.
     * @param {Object} visited An object to track visited vertices to prevent revisits and infinite loops.
     * @param {Array} result An array that accumulates the vertices visited in DFS order.
     *
     * @returns {Array} The array of vertices visited in DFS order.
     */
    dfsRecurrsive(vertex, visited = {}, result = []) {
        // Error Handling for invalid or non-existent vertices
        if (!vertex || !this.adjacencyList[vertex]) {
            console.log(`Invalid value of vertex - ${vertex}`)
            return result
        }

        // Mark this node visited
        visited[vertex] = true
        result.push(vertex)

        // Recursively visit all unvisited neighbors
        this.adjacencyList[vertex].forEach(neighbour => {
            if (!visited[neighbour]) this.dfsRecurrsive(neighbour, visited, result)
        })

        return result
    }

    /**
     * Performs a iterative depth-first search (DFS) starting from a given vertex.
     *
     * @param {string|number} v The starting vertex for the DFS.
     *
     * @returns {Array} The array of vertices visited in DFS order.
     */
    dfs(vertex) {
        const stack = [vertex]
        const visited = {}
        const result = []

        // Error Handling for invalid or non-existent vertices
        if (!vertex || !this.adjacencyList[vertex]) {
            console.log(`Invalid value of vertex - ${vertex}`)
            return result
        }

        let v = null
        while (stack.length) {
            v = stack.pop()

            // Process v if unvisited
            if (!visited[v]) {
                result.push(v)
                visited[v] = true

                this.adjacencyList[v].forEach(neighbour => stack.push(neighbour))
            }
        }
        return result
    }

    /**
     * Performs a iterative breadth-first search (DFS) starting from a given vertex.
     * - Not a scalable solution
     * - queue.shift() has Time Complexity of O(n)
     * - So, use custom / library queue which has O(1) time complexity for shift() & pop() operations
     *
     * @param {string|number} v The starting vertex for the BFS.
     *
     * @returns {Array} The array of vertices visited in BFS order.
     */
    bfs(vertex) {
        const queue = [vertex]
        const visited = {}
        const result = []

        // Error Handling for invalid or non-existent vertices
        if (!vertex || !this.adjacencyList[vertex]) {
            console.log(`Invalid value of vertex - ${vertex}`)
            return result
        }

        let v = null
        while (queue.length) {
            v = queue.shift()

            // Process v if unvisited
            if (!visited[v]) {
                result.push(v)
                visited[v] = true

                this.adjacencyList[v].forEach(neighbour => queue.push(neighbour))
            }
        }
        return result
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

console.log(g.dfsRecurrsive())
console.log(g.dfsRecurrsive())
console.log(g.dfsRecurrsive('dls'))
console.log(g.dfs('dls'))
console.log(g.dfs('dallas'))
console.log(g.dfs('dallas'))

const g1 = new Graph()

g1.addVertex('A')
g1.addVertex('B')
g1.addVertex('C')
g1.addVertex('D')
g1.addVertex('E')
g1.addVertex('F')

g1.addEdge('A', 'B')
g1.addEdge('A', 'C')
g1.addEdge('B', 'D')
g1.addEdge('C', 'E')
g1.addEdge('D', 'E')
g1.addEdge('D', 'F')
g1.addEdge('E', 'F')

//          A
//        /   \
//       B     C
//       |     |
//       D --- E
//        \   /
//          F

console.log(g1.dfsRecurrsive('A'))
console.log(g1.dfs('A'))
console.log(g1.bfs('A'))
