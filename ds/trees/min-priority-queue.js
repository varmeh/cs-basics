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
        if (this.heap.length === 1) return null

        const priorityNode = this.heap[1]

        // Now replace min with last value of the heap
        this.heap[1] = this.heap.pop()

        // Bubble down the new root to restore heap properties
        if (this.heap.length > 1) {
            this._bubbleDown(1)
        }

        return priorityNode.value
    }
}

if (require.main === module) {
    const queue = new PriorityQueue()
    queue.enqueue('headache', 21)
    queue.enqueue('migrane', 33)
    queue.enqueue('injury', 39)
    queue.enqueue('accident', 41)
    console.log(queue)

    console.log(`Servicing Now - ${queue.dequeue()}`)
    console.log(`Servicing Now - ${queue.dequeue()}`)

    console.log(queue)
}

module.exports = PriorityQueue
