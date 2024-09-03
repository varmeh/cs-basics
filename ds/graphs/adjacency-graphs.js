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

class PriorityQueue {
    constructor() {
        this.queue = []
    }

    get size() {
        return this.queue.length
    }

    enqueue(value, priority) {
        this.queue.push([value, priority])
        this._sort()
    }

    dequeue() {
        return this.queue.shift()[0]
    }

    updatePriority(value, newPriority) {
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i][0] === value) {
                this.queue[i][1] = newPriority
                return this._sort()
            }
        }
    }

    _sort() {
        this.queue.sort((a, b) => a[1] - b[1])
    }
}

class Graph {
    constructor() {
        this.adjacencyMaps = {}
    }

    addVertex(vertex) {
        if (!this.adjacencyMaps[vertex]) this.adjacencyMaps[vertex] = {}
    }

    addEdge(v1, v2, weight) {
        // Both vertex exists
        if (this.adjacencyMaps[v1] && this.adjacencyMaps[v2]) {
            if (!this.adjacencyMaps[v1][v2]) this.adjacencyMaps[v1][v2] = weight
            if (!this.adjacencyMaps[v2][v1]) this.adjacencyMaps[v2][v1] = weight
            return true
        }
        return false
    }

    shortestPath(start, end) {
        const distances = {} // Tracks the shortest distance to each vertex from the start vertex
        const previous = {} // Tracks the previous vertex in the shortest path
        const priorityQueue = new PriorityQueue() // Min-priority queue to process the vertex with the shortest distance next
        const visited = {} // Tracks visited vertices

        distances[start] = 0
        previous[start] = null
        priorityQueue.enqueue(start, 0)

        while (priorityQueue.size > 0) {
            let currentVertex = priorityQueue.dequeue()
            visited[currentVertex] = true

            if (currentVertex === end) {
                // Construct the shortest path by backtracking through `previous`
                let path = []
                let tempVertex = end

                while (tempVertex) {
                    path.push(tempVertex)
                    tempVertex = previous[tempVertex]
                }

                return [path.reverse(), distances[end]]
            }

            // Explore neighbors of the current vertex
            for (let neighbor of Object.keys(this.adjacencyMaps[currentVertex])) {
                if (visited[neighbor]) continue

                // calculate distance to neighboring weight
                let currentDistance = distances[currentVertex] + this.adjacencyMaps[currentVertex][neighbor]

                if (distances[neighbor] === undefined) {
                    distances[neighbor] = currentDistance
                    previous[neighbor] = currentVertex
                    priorityQueue.enqueue(neighbor, distances[neighbor])
                } else if (currentDistance < distances[neighbor]) {
                    // This new distance is shorter. So, update neighbor
                    distances[neighbor] = currentDistance
                    previous[neighbor] = currentVertex
                    priorityQueue.updatePriority(neighbor, distances[neighbor])
                }
            }
        }
        return [[], Infinity] // If no path is found
    }
}

const g = new Graph()

g.addVertex('A')
g.addVertex('B')
g.addVertex('C')
g.addVertex('D')
g.addVertex('E')
g.addVertex('F')

g.addEdge('A', 'B', 4)
g.addEdge('A', 'C', 2)
g.addEdge('B', 'E', 3)
g.addEdge('C', 'D', 2)
g.addEdge('C', 'F', 4)
g.addEdge('D', 'E', 3)
g.addEdge('D', 'F', 1)
g.addEdge('E', 'F', 1)

console.log(g)

console.log(g.shortestPath('A', 'E'))
