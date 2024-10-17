class SkipListNode {
    constructor(value, level) {
        this.value = value
        this.forward = new Array(level).fill(null) // Forward pointers for each level
    }
}

/**
 * maxLevel should be a function of number of nodes - MaxLevel ≈ log₂(n)
 * log₂(10) ≈ 4, so start with 4
 */

class SkipList {
    constructor(p = 0.5, initialMaxLevel = 4) {
        this.maxLevel = initialMaxLevel // Start with a small max level
        this.p = p // Probability for level generation
        this.header = new SkipListNode(null, this.maxLevel) // Header node with max levels
        this.size = 0 // tracking no of nodes
    }

    // Insert a new value into the skip list
    insert(value) {
        const update = this._findUpdateNodes(value) // Get update nodes`

        // Determine the random level for the new node
        let nodeLevel = this._randomLevel()

        // Create a new node with the determined level
        let newNode = new SkipListNode(value, nodeLevel)

        // Insert the new node by updating forward pointers at each level up to nodeLevel
        for (let i = 0; i < nodeLevel; i++) {
            newNode.forward[i] = update[i].forward[i]
            update[i].forward[i] = newNode
        }

        // Increment the size and adjust the max level if necessary
        this.size++
        this._adjustMaxLevel() // Adjust max level based on the new size
    }

    // Private method to traverse the skip list and find update nodes
    _findUpdateNodes(value) {
        const update = new Array(this.maxLevel) // Array to track nodes at each level that need updating
        let current = this.header

        for (let i = this.maxLevel - 1; i >= 0; i--) {
            while (current.forward[i] !== null && current.forward[i].value < value) {
                current = current.forward[i]
            }
            update[i] = current // Last node at level i before the target node
        }

        return update
    }

    // Internal method to determine random level for new node
    _randomLevel() {
        let level = 1
        // Keep increasing level while random condition holds and maxLevel is not reached
        while (Math.random() < this.p && level < this.maxLevel) {
            level++
        }
        return level
    }

    _adjustMaxLevel() {
        // Calculate the new recommended max level based on the size of the skip list
        let newMaxLevel = Math.floor(Math.log2(this.size + 1))

        // If the new max level is greater than the current max level, adjust the header
        if (newMaxLevel > this.maxLevel) {
            // Increase header levels by adjusting its forward array
            let oldMaxLevel = this.maxLevel
            this.maxLevel = newMaxLevel
            this.header.forward.length = this.maxLevel // Expand header's forward pointers
            for (let i = oldMaxLevel; i < this.maxLevel; i++) {
                this.header.forward[i] = null // Initialize new levels as empty
            }
        }
    }

    delete(value) {
        const update = this._findUpdateNodes(value) // Get update nodes
        let current = update[0].forward[0] // Potential target node

        // Check if the target node exists and matches the value
        if (current === null || current.value !== value) {
            console.log(`Value ${value} not found in Skip List.`)
            return false
        }

        // Remove the node by updating forward pointers
        for (let i = 0; i < current.forward.length; i++) {
            update[i].forward[i] = current.forward[i]
        }

        // Optional: Clear the forward pointers of the removed node for garbage collection
        for (let i = 0; i < current.forward.length; i++) {
            current.forward[i] = null
        }

        // Decrement the size
        this.size--

        return true
    }

    // Search for a value in the skip list
    search(value) {
        let current = this.header

        // Traverse from the highest level down to level 0
        for (let i = this.maxLevel - 1; i >= 0; i--) {
            while (current.forward[i] !== null && current.forward[i].value < value) {
                current = current.forward[i]
            }
        }

        // Move to the possible target node
        current = current.forward[0]

        // Check if the current node has the target value
        if (current !== null && current.value === value) {
            return true // Value found
        } else {
            return false // Value not found
        }
    }

    printList() {
        let current = this.header.forward[0]
        let str = ''
        while (current !== null) {
            str += `${current.value} -> `
            current = current.forward[0]
        }

        console.log(str.replace(/.{3}$/, ''))
    }
}

// Example Usage
const skipList = new SkipList()

// Insert values
skipList.insert(3)
skipList.insert(8)
skipList.insert(7)
skipList.insert(6)

console.log('Skip List after insertions:')
skipList.printList() // Expected Output: 3 -> 6 -> 7 -> 8 -> null

// Search for existing and non-existing values
console.log('\nSearching for value 6:')
console.log(`Value 6 found: ${skipList.search(6)}`) // Expected Output: true

console.log('\nSearching for value 10:')
console.log(`Value 10 found: ${skipList.search(10)}`) // Expected Output: false

// Delete a value
console.log('\nDeleting value 7...')
const deleted7 = skipList.delete(7)
console.log(`Deletion of 7 successful: ${deleted7}`)
console.log('Skip List after deletion:')
skipList.printList() // Expected Output: 3 -> 6 -> 8 -> null

// Attempt to delete a non-existent value
console.log('\nAttempting to delete value 10...')
const deleted10 = skipList.delete(10) // Expected Output: Value 10 not found in Skip List.
console.log(`Deletion of 10 successful: ${deleted10}`)
console.log('Skip List after attempting to delete 10:')
skipList.printList() // Expected Output: 3 -> 6 -> 8 -> null

// Insert more values
console.log('\nInserting value 5...')
skipList.insert(5)
console.log('Inserting value 10...')
skipList.insert(10)

console.log('Skip List after more insertions:')
skipList.printList() // Expected Output: 3 -> 5 -> 6 -> 8 -> 10 -> null

// Delete another value
console.log('\nDeleting value 3...')
const deleted3 = skipList.delete(3)
console.log(`Deletion of 3 successful: ${deleted3}`)
console.log('Skip List after deleting value 3:')
skipList.printList() // Expected Output: 5 -> 6 -> 8 -> 10 -> null

// Search for values
console.log('\nSearching for value 5:')
console.log(`Value 5 found: ${skipList.search(5)}`) // Expected Output: true

console.log('\nSearching for value 7:')
console.log(`Value 7 found: ${skipList.search(7)}`) // Expected Output: false
