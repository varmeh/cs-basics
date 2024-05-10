class Node {
    constructor(value, listNo) {
        this.value = value
        this.listNo = listNo
    }
}

class MinHeap {
    constructor() {
        this.heap = [null]
    }

    enqueue(value, listNo) {
        const node = new Node(value, listNo)
        this.heap.push(node)
        this._bubbleUp(this.heap.length - 1)
    }

    // Move smaller child up
    _bubbleUp(index) {
        let childIndex = index
        let parentIndex

        while (childIndex > 1) {
            parentIndex = this._parentIndex(childIndex)

            // When child value is greater than or equal to parent value, stop
            if (this.heap[childIndex].value >= this.heap[parentIndex].value) break

            // Otherwise, swap child and parent
            this._swap(childIndex, parentIndex)
            childIndex = parentIndex
        }
    }

    dequeue() {
        if (this.isEmpty()) return null

        // Fetch the node at the root which has the highest value (smallest value in a min-heap)
        const priorityNode = this.heap[1]

        // Replace the root with the last element in the heap
        const lastElement = this.heap.pop()

        // If there are still elements left after popping, we need to re-heapify
        if (this.heap.length > 1) {
            this.heap[1] = lastElement
            this._bubbleDown(1)
        }

        return [priorityNode.value, priorityNode.listNo]
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
            if (leftChildIndex < this.heap.length && this.heap[leftChildIndex].value < this.heap[smallestIndex].value) {
                smallestIndex = leftChildIndex
            }

            // Check if right child exists and is smaller than the smallest so far (parent or left child)
            if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].value < this.heap[smallestIndex].value) {
                smallestIndex = rightChildIndex
            }

            // If the smallest value is still the parent, the heap property is satisfied
            if (smallestIndex === parentIndex) break

            // If not, swap the parent with the smallest child and continue
            this._swap(parentIndex, smallestIndex)
            parentIndex = smallestIndex
        }
    }

    isEmpty() {
        return this.heap.length <= 1
    }

    _parentIndex(n) {
        return Math.floor(n / 2)
    }

    _swap(a, b) {
        let temp = this.heap[a]
        this.heap[a] = this.heap[b]
        this.heap[b] = temp
    }

    _leftChildIndex(n) {
        return 2 * n
    }

    _rightChildIndex(n) {
        return 2 * n + 1
    }
}

function mergeKSortedLists(lists) {
    const k = lists.length
    const pointerPosInList = new Array(k).fill(0)

    // build min heap
    const minHeap = new MinHeap()
    let valuePos = -1
    for (let i = 0; i < k; i++) {
        valuePos = pointerPosInList[i]
        minHeap.enqueue(lists[i][valuePos], i)
    }
    // console.log(minHeap)

    const result = []

    while (!minHeap.isEmpty()) {
        let [value, listNo] = minHeap.dequeue()
        result.push(value)

        // increment pointer for new pos
        pointerPosInList[listNo]++

        if (pointerPosInList[listNo] < lists[listNo].length) {
            let value = lists[listNo][pointerPosInList[listNo]]
            minHeap.enqueue(value, listNo)
        }
    }

    return result
}

console.log(
    mergeKSortedLists([
        [1, 4, 5],
        [1, 3, 4],
        [2, 6]
    ])
) // ->[1,1,2,3,4,4,5,6]
