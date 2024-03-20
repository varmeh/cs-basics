// Implemented using Max Binary Heap

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

    _righChildIndex(n) {
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

    // Move bigger child up
    _bubbleUp(index) {
        let cidx = index
        let pidx = null

        while (cidx > 1) {
            pidx = this._parentIndex(cidx)

            // When child priority is less than or equal to parent priority break
            if (this.heap[cidx].priority <= this.heap[pidx].priority) break

            // Move Value up
            this._swap(cidx, pidx)
            cidx = pidx
        }
    }

    // Move smaller parent down
    _bubbleDown(index) {
        let pidx = index // parent index
        let lidx = null // left child index
        let ridx = null // right child index
        let largestidx = null // index of largest of 3 values - parent, left & right

        while (true) {
            lidx = this._leftChildIndex(pidx)
            ridx = this._righChildIndex(pidx)
            largestidx = pidx

            // Check if left child exists and is greater than the parent
            if (lidx < this.heap.length && this.heap[lidx].priority > this.heap[largestidx].priority) {
                largestidx = lidx
            }

            // Check if right child exists and is greater than the largest so far (parent or left child)
            if (ridx < this.heap.length && this.heap[ridx].priority > this.heap[largestidx].priority) {
                largestidx = ridx
            }

            // If the largest value is still the parent, the heap property is satisfied
            if (largestidx === pidx) break

            // If not, swap the parent with the largest child and continue
            this._swap(pidx, largestidx)
            pidx = largestidx // Move down to the largest child's position
        }
    }

    // Add a new value & bubble up
    enqueue(value, priority) {
        const node = new Node(value, priority)

        this.heap.push(node)
        this._bubbleUp(this.heap.length - 1)
    }

    // Remove most important task
    dequeue() {
        // Empty heap
        if (this.heap.length === 1) return null

        const priorityNode = this.heap[1]

        // Now replace max with last value of the heap
        this.heap[1] = this.heap.pop()

        // Last value was definitely smaller
        // So, let's balance it by bubbling down
        this._bubbleDown(1)

        return priorityNode.value
    }

    tree() {
        if (this.heap.length === 1) {
            console.log('The heap is empty')
            return
        }

        let depth = Math.floor(Math.log2(this.heap.length - 1)) + 1
        const maxWidth = 80 // Approximate width of the tree at the bottom level

        let index = 1 // Start with the first index in the heap array

        console.log(`\n${'-'.repeat(maxWidth)}\n`)
        for (let level = 0; level < depth; level++) {
            let levelNodes = Math.pow(2, level) // Number of nodes at the current level
            let levelSpacing = Math.floor(maxWidth / levelNodes) // Spacing between nodes at this level
            let line = ''

            // Leading space for the first node in the level to center it
            let leadingSpaces = Math.floor(levelSpacing / 2) - 1
            line += ' '.repeat(Math.max(0, leadingSpaces))

            for (let n = 0; n < levelNodes && index < this.heap.length; n++, index++) {
                let nodeVal = `${this.heap[index].value}(${this.heap[index].priority})`
                line += nodeVal + ' '.repeat(Math.abs(levelSpacing - nodeVal.length))
            }

            console.log(line)
        }

        console.log()
    }
}

const queue = new PriorityQueue()
queue.enqueue('headache', 21)
queue.enqueue('migrane', 33)
queue.tree()
queue.enqueue('injury', 39)
queue.tree()
queue.enqueue('accident', 41)
queue.tree()

console.log(`Servicing Now - ${queue.dequeue()}`)
queue.tree()
console.log(`Servicing Now - ${queue.dequeue()}`)
queue.tree()
