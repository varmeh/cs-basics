function bfsIsItATree({ nodeCount, edgeStart, edgeEnd }) {
    // Write your code here.

    //1. Build Graph

    // -- Create Empty Graph
    const adjacencyList = {}

    for (let i = 0; i < nodeCount; i++) {
        adjacencyList[i] = []
    }

    // Fill Edges in graph
    for (let i = 0; i < edgeStart.length; i++) {
        adjacencyList[edgeStart[i]].push(edgeEnd[i])
        adjacencyList[edgeEnd[i]].push(edgeStart[i])
    }

    // 2. Run BFS
    const visited = {}
    const parent = {}

    // Returns true if there is a cycle
    let bfs = startNode => {
        const queue = [startNode]
        visited[startNode] = true
        parent[startNode] = -1

        while (queue.length) {
            let node = queue.shift()

            for (let neighbour of adjacencyList[node]) {
                if (!visited[neighbour]) {
                    // neighbour is a child
                    visited[neighbour] = true
                    parent[neighbour] = node
                    queue.push(neighbour)
                } else {
                    // If visited and not the parent, it's a cycle
                    if (neighbour !== parent[node]) {
                        // cross edge
                        console.log(`Cycle - parent of node ${node} is ${parent[node]} !== neighbour ${neighbour}`)
                        return true
                    }
                }
            }
        }
        return false
    }

    if (bfs(0)) return false

    return Object.keys(visited).length !== nodeCount ? false : true
}

console.log(
    'Tree: ',
    bfsIsItATree({
        nodeCount: 4,
        edgeStart: [0, 0, 0, 1],
        edgeEnd: [1, 2, 3, 0]
    })
)

console.log(
    'Tree: ',
    bfsIsItATree({
        nodeCount: 6,
        edgeStart: [4, 4, 4, 2, 1],
        edgeEnd: [3, 5, 0, 0, 0]
    })
)
