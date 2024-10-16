/**
 * Min Priority Queue
 *  - Implemented using Min Binary Heap
 *  - In it, parent nodes are always smaller than child nodes
 *  - Implemented using array
 *      - For a node at index `n`
 *      - Left Child node is at index `2n`
 *      - Right Child node is at index `2n+1`
 *      - For any node `n`, parent is at index `n/2`
 *
 *  - Enqueue a node
 *      - A node is Always inserted at end of the heap
 *      - Then, it is bubbled up till it's parent has lower priority value
 *      - This ensures that Min value is always at the top
 *
 *  - Dequeue a node
 *      - A node is always removed from root which is index `1` (index 0 is not used)
 *      - To remove the node, it's value is swapped with last node of array
 *      - Then, this value is bubbled down, till we have min value at the top
 */

class Node {
    constructor(value, priority) {
        this.value = value
        this.priority = priority
    }
}

class PriorityQueue {
    constructor() {
        this.heap = [null]
    }

    _leftChildIndex(n) {
        return 2 * n
    }

    _rightChildIndex(n) {
        return 2 * n + 1
    }

    _parentIndex(n) {
        return Math.floor(n / 2)
    }

    _swap(a, b) {
        let temp = this.heap[a]
        this.heap[a] = this.heap[b]
        this.heap[b] = temp
    }

    // Move smaller child up
    _bubbleUp(index) {
        let childIndex = index
        let parentIndex

        while (childIndex > 1) {
            parentIndex = this._parentIndex(childIndex)

            // When child priority is greater than or equal to parent priority, stop
            if (this.heap[childIndex].priority >= this.heap[parentIndex].priority) break

            // Otherwise, swap child and parent
            this._swap(childIndex, parentIndex)
            childIndex = parentIndex
        }
    }

    // Move larger parent down
    _bubbleDown(index) {
        let parentIndex = index
        let leftChildIndex
        let rightChildIndex
        let smallestIndex

        while (true) {
            leftChildIndex = this._leftChildIndex(parentIndex)
            rightChildIndex = this._rightChildIndex(parentIndex)
            smallestIndex = parentIndex

            // Check if left child exists and is smaller than the parent
            if (leftChildIndex < this.heap.length && this.heap[leftChildIndex].priority < this.heap[smallestIndex].priority) {
                smallestIndex = leftChildIndex
            }

            // Check if right child exists and is smaller than the smallest so far (parent or left child)
            if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].priority < this.heap[smallestIndex].priority) {
                smallestIndex = rightChildIndex
            }

            // If the smallest value is still the parent, the heap property is satisfied
            if (smallestIndex === parentIndex) break

            // If not, swap the parent with the smallest child and continue
            this._swap(parentIndex, smallestIndex)
            parentIndex = smallestIndex
        }
    }

    enqueue(value, priority) {
        const node = new Node(value, priority)
        this.heap.push(node)
        this._bubbleUp(this.heap.length - 1)
    }

    dequeue() {
        if (this.isEmpty()) return null

        // Fetch the node at the root which has the highest priority (smallest value in a min-heap)
        const priorityNode = this.heap[1]

        // Replace the root with the last element in the heap
        const lastElement = this.heap.pop()

        // If there are still elements left after popping, we need to re-heapify
        if (this.heap.length > 1) {
            this.heap[1] = lastElement
            this._bubbleDown(1)
        }

        return priorityNode.value
    }

    isEmpty() {
        return this.heap.length <= 1
    }
}

if (require.main === module) {
    const queue = new PriorityQueue()
    console.log(`Is queue empty: ${queue.isEmpty()}`)
    queue.enqueue('headache', 21)
    queue.enqueue('migrane', 33)
    queue.enqueue('injury', 39)
    queue.enqueue('accident', 41)
    console.log(queue)

    console.log(`Servicing Now - ${queue.dequeue()}`)
    console.log(`Servicing Now - ${queue.dequeue()}`)
    console.log(`Is queue empty: ${queue.isEmpty()}`)

    console.log(`Servicing Now - ${queue.dequeue()}`)
    console.log(`Servicing Now - ${queue.dequeue()}`)
    console.log(`Is queue empty: ${queue.isEmpty()}`)

    console.log(queue)
}

module.exports = PriorityQueue
