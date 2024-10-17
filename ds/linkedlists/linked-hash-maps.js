class LinkedHashMap {
    constructor() {
        this.map = new Map() // Key to node mapping
        this.head = null // First node in the linked list
        this.tail = null // Last node in the linked list
    }

    // Adds or updates a key-value pair
    put(key, value) {
        let node
        if (this.map.has(key)) {
            // Update existing node's value
            node = this.map.get(key)
            node.value = value
            return
        }

        // Create a new node
        node = { key, value, prev: null, next: null }
        this.map.set(key, node)

        if (this.head === null) {
            // First node in the list
            this.head = this.tail = node
        } else {
            // Append to the end of the list
            this.tail.next = node
            node.prev = this.tail
            this.tail = node
        }
    }

    // Retrieves a value by key
    get(key) {
        const node = this.map.get(key)
        return node ? node.value : undefined
    }

    // Removes a key-value pair
    remove(key) {
        const node = this.map.get(key)
        if (!node) return false

        // Update linked list pointers
        if (node.prev) node.prev.next = node.next
        else this.head = node.next // Node is head

        if (node.next) node.next.prev = node.prev
        else this.tail = node.prev // Node is tail

        this.map.delete(key)
        return true
    }

    // Returns an iterator over the entries in insertion order
    [Symbol.iterator]() {
        let current = this.head
        return {
            next: () => {
                if (current) {
                    const value = { key: current.key, value: current.value }
                    current = current.next
                    return { value, done: false }
                }
                return { done: true }
            }
        }
    }

    // Returns the number of key-value pairs
    size() {
        return this.map.size
    }

    // Clears all entries
    clear() {
        this.map.clear()
        this.head = this.tail = null
    }
}

const linkedHashMap = new LinkedHashMap()

linkedHashMap.put('apple', 1)
linkedHashMap.put('banana', 2)
linkedHashMap.put('cherry', 3)

console.log(linkedHashMap.get('banana')) // Output: 2

// Iterate over entries in insertion order
for (const entry of linkedHashMap) {
    console.log(`${entry.key}: ${entry.value}`)
}
// Output:
// apple: 1
// banana: 2
// cherry: 3

linkedHashMap.remove('banana')

for (const entry of linkedHashMap) {
    console.log(`${entry.key}: ${entry.value}`)
}
// Output:
// apple: 1
// cherry: 3
