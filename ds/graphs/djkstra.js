class PriorityQueueOld {
    constructor() {
        this.queue = []
    }

    get size() {
        return this.queue.length
    }

    insert(value, priority) {
        this.queue.push([value, priority])
        this._sort()
    }

    extractMin() {
        return this.queue.shift()
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

class PriorityQueue {
    constructor() {
        this.queue = []
    }

    get size() {
        return this.queue.length
    }

    insert(priority, node, parent) {
        this.queue.push([priority, node, parent])
        this._sort()
    }

    extractMin() {
        return this.queue.shift()
    }

    updatePriority(value, newPriority) {
        for (const element of this.queue) {
            if (element[1] === value) {
                element[0] = newPriority
                return this._sort()
            }
        }
    }

    _sort() {
        this.queue.sort((a, b) => a[0] - b[0])
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

    // This verison does not update node priority in priority Queue
    // So, whenever you encounter a new priority for a node, we add it to PriorityQueue
    // This happens till we have not processed the item once
    shortestPath(start, end) {
        const captured = {} // Tracks the shortest distance to each vertex from the start vertex
        const queue = new PriorityQueue() // Min-priority queue
        const parents = {}

        queue.insert(0, start, null)

        while (queue.size > 0) {
            const [distance, node, parent] = queue.extractMin()
            if (captured[node] !== undefined) continue

            captured[node] = distance
            parents[node] = parent

            for (let neighbor of Object.keys(this.adjacencyMaps[node])) {
                if (captured[neighbor] !== undefined)
                    // Shortest distance to neighbor from start already processed & this is an higher distance version
                    continue

                let neighborDistance = distance + this.adjacencyMaps[node][neighbor]
                queue.insert(neighborDistance, neighbor, node)
            }
        }

        // Check if end exists in parents
        if (parents[end] !== undefined) {
            // Construct the shortest path by backtracking through `parents`
            let path = []
            let tempVertex = end

            while (tempVertex) {
                path.push(tempVertex)
                tempVertex = parents[tempVertex]
            }

            return [path.reverse(), captured[end]]
        }

        return [[], Infinity] // If no path is found
    }

    shortestPathOld(start, end) {
        const captured = {} // Tracks the shortest distance to each vertex from the start vertex
        const parents = {} // Tracks the parents vertex in the shortest path
        const priorityQueue = new PriorityQueueOld() // Min-priority queue to process the vertex with the shortest distance next
        const visited = {} // Tracks visited vertices

        captured[start] = 0
        parents[start] = null
        priorityQueue.enqueue(start, 0)

        while (priorityQueue.size > 0) {
            let currentVertex = priorityQueue.dequeue()
            visited[currentVertex] = true

            if (currentVertex === end) {
                // Construct the shortest path by backtracking through `parents`
                let path = []
                let tempVertex = end

                while (tempVertex) {
                    path.push(tempVertex)
                    tempVertex = parents[tempVertex]
                }

                return [path.reverse(), captured[end]]
            }

            // Explore neighbors of the current vertex
            for (let neighbor of Object.keys(this.adjacencyMaps[currentVertex])) {
                if (visited[neighbor]) continue

                // calculate distance to neighboring weight
                let currentDistance = captured[currentVertex] + this.adjacencyMaps[currentVertex][neighbor]

                if (captured[neighbor] === undefined) {
                    captured[neighbor] = currentDistance
                    parents[neighbor] = currentVertex
                    priorityQueue.enqueue(neighbor, captured[neighbor])
                } else if (currentDistance < captured[neighbor]) {
                    // This new distance is shorter. So, update neighbor
                    captured[neighbor] = currentDistance
                    parents[neighbor] = currentVertex
                    priorityQueue.updatePriority(neighbor, captured[neighbor])
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
