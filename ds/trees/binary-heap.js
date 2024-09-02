// Max Binary Heap - parent nodes are always greator than child nodes
// Min Binary Heap - parent nodes are always smaller than child nodes

// Used to implement Priority Queue

// Implementing Binary Heap
class BinaryHeap {
    constructor(array = []) {
        this.heap = [null]

        if (array.length) {
            this.heap = this.heap.concat(array)
        }
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

    // Move bigger child up
    _bubbleUp(index) {
        let cidx = index
        let pidx = null

        while (cidx > 1) {
            pidx = this._parentIndex(cidx)

            // When child value is less than or equal to parent value break
            if (this.heap[cidx] <= this.heap[pidx]) break

            // Move Value up
            this._swap(cidx, pidx)
            cidx = pidx
        }
    }

    // Add a new value & bubble up
    insert(value) {
        this.heap.push(value)
        this._bubbleUp(this.heap.length - 1)
    }

    // Move smaller parent down
    _bubbleDown(index) {
        let pidx = index // parent index

        while (pidx < Math.floor(this.heap.length / 2)) {
            let lidx = this._leftChildIndex(pidx)
            let ridx = this._rightChildIndex(pidx)

            let leftValue = this.heap[lidx]
            let rightValue = this.heap[ridx]
            let parValue = this.heap[pidx]

            // Check if both childs are smaller
            if (leftValue < parValue && rightValue < parValue) break

            // Select bigger index for swaping
            let swapIndex = leftValue > rightValue ? lidx : ridx

            // If not, swap the parent with the largest child and continue
            this._swap(pidx, swapIndex)
            pidx = swapIndex // Move down to the largest child's position
        }
    }

    // Extract Max Value from Top
    extractMax() {
        // Empty heap
        if (this.isEmpty()) return null

        // Fetch the node at the root which has the highest priority (max value in a max-heap)
        const nodeValue = this.heap[1]

        // Replace the root with the last element in the heap
        const lastElement = this.heap.pop()

        // If there are still elements left after popping, we need to re-heapify
        if (this.heap.length > 1) {
            this.heap[1] = lastElement
            this._bubbleDown(1)
        }

        return nodeValue
    }

    isEmpty() {
        return this.heap.length <= 1
    }

    print() {
        console.log(this.heap.slice(1).toString())
    }

    // Generated using GPT
    tree() {
        if (this.heap.length === 1) {
            console.log('The heap is empty')
            return
        }

        let depth = Math.floor(Math.log2(this.heap.length - 1)) + 1
        const maxWidth = Math.pow(2, depth) * 2 // Approximate width of the tree at the bottom level

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
                let nodeVal = this.heap[index].toString()
                line += nodeVal + ' '.repeat(levelSpacing - nodeVal.length)
            }

            console.log(line)
        }

        console.log()
    }
}

// const heap = new BinaryHeap()
// heap.print()
// heap.insert(41)
// heap.insert(39)
// heap.insert(33)
// heap.insert(18)
// heap.insert(27)
// heap.insert(12)

const heap = new BinaryHeap([41, 39, 33, 18, 27, 12])
heap.tree()

heap.insert(55)
heap.tree()

heap.insert(59)
heap.insert(65)
heap.tree()

console.log(`Extracted Max: ${heap.extractMax()}`)
heap.tree()

console.log(`Extracted Max: ${heap.extractMax()}`)
heap.tree()
