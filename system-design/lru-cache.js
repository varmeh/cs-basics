class Node {
    constructor(key, value) {
        this.key = key
        this.value = value
        this.prev = null
        this.next = null
    }
}

/** -----------------------------------------------------------------------
 * - Preferred Implementation
 *
 * - Nodes saved as value in hmap
 * - DLL is managed by chaining next & prev of nodes with head & tail
 *
 */

class Cache {
    constructor(size) {
        this.capacity = size
        this.hmap = {} // empty hash table

        // DLL in place
        this.head = null
        this.tail = null
        this.size = 0
    }

    get(key) {
        if (!(key in this.hmap)) return -1 // Cache miss

        const node = this.hmap[key]
        this._moveToHead(node)
        return node.value
    }

    _moveToHead(node) {
        if (node === this.head) return

        if (node === this.tail) {
            this.tail = node.prev
            this.tail.next = null
        }

        if (node.prev) {
            node.prev.next = node.next
        }

        if (node.next) {
            node.next.prev = node.prev
        }

        node.next = this.head
        node.prev = null
        this.head.prev = node
        this.head = node
    }

    put(key, value) {
        if (key in this.hmap) {
            // Update Operation
            this.hmap[key].value = value
            this._moveToHead(this.hmap[key])
            return
        }

        // Cache Full
        if (this._isFull()) this._removeLRU()

        const node = new Node(key, value)
        node.next = this.head

        if (this.head) {
            this.head.prev = node
        }

        this.head = node

        if (!this.tail) {
            // 1st node in list
            this.tail = node
        }

        this.hmap[key] = node
        this.size++
    }

    _isFull() {
        return this.capacity === this.size
    }

    _removeLRU() {
        const node = this.tail

        if (node === this.head) {
            this.head = node.next
        }

        if (node === this.tail) {
            this.tail = node.prev
        }

        if (node.prev) {
            node.prev.next = node.next
        }

        if (node.next) {
            node.next.prev = node.prev
        }

        node.prev = null
        node.next = null

        delete this.hmap[node.key]
        this.size--
    }
}

const cache = new Cache(2)
cache.put(1, 1)
cache.put(2, 2)
// console.log(cache)
console.log(cache.get(1)) // sets 1 to highest priority
// console.log(cache)

cache.put(3, 3) //evicts key 2
console.log(cache.get(2))
// console.log(cache)
cache.put(4, 4) // evicts key 1
console.log(cache.get(1))
console.log(cache.get(3))
console.log(cache.get(4))
console.log(cache)

/** --------------------- Sample Implementation ----------------------------
 * - Implementation using a separate Doubly Link List Class
 *
 * - Pseudo Implementation.
 * - An experiment to create separation of concerns
 * - As DLL nodes are anyways accessed directly in Cache, it would be good
 * - to have a single Cache class
 *
 * - NOT Recommended
 */

class DLL {
    constructor() {
        this.head = null
        this.tail = null
        this.size = 0
    }

    get(node) {
        // As accessed, so set it to highest priority

        // 1st remove node from middle
        const nextNode = node.next
        nextNode.prev = node.prev

        const prevNode = node.prev
        prevNode.next = node.next

        // Node moved to head
        node.prev = null
        node.next = this.head
        this.head = node

        return node.value
    }

    put(value) {
        const node = new Node(key, value)
        // Always put at head
        const oldHead = this.head
        oldHead.prev = node
        node.next = oldHead
        this.head = node

        this.size++

        return node
    }

    lruKey() {
        return this.tail
    }

    delete(node) {
        if (node === this.head) {
            // Head Node
            const newHead = node.next
            newHead.prev = null
            this.head = newHead
        } else if (node === this.tail) {
            // Tail Node
            const newTail = node.prev
            newTail.next = null
            this.tail = newTail
        } else {
            // Middle Node
            const nodePrev = node.prev
            nodePrev.next = node.next
            const nodeNext = node.next
            nodeNext.prev = node.prev
        }
        this.size--
    }
}

class Cache1 {
    constructor(size) {
        this.capacity = size
        this.hmap = {} // empty hash table
        this.sortedList = new DLL()
    }

    get(key) {
        if (this.hmap[key] === undefined) return null
        let node = this.hmap(key)
        return this.sortedList.get(node)
    }

    put(key, value) {
        if (this.hmap[key] !== undefined) {
            // User updating existing value. So, delete existing value, followed by put operation
            this.sortedList.delete(this.hmap[key])
        }

        if (this.capacity === this.sortedList.size) {
            // Remove Least Recently Used Node which TailKey
            const tailNode = this.sortedList.lruKey()
            this.sortedList.delete(tailNode)
        }

        this.hmap[key] = this.sortedList.put(value)
    }
}
