/**
 * Hash Function:
 *      A hash function is a function that takes an input (or 'message') and
 *      returns a fixed-size string of bytes
 *
 * Key Properties:
 *      Deterministic - y = hash(x). So, for any value of x, y is same every time
 *      Fast Computation - Computation time should be independent of input size
 *      Fixed Output Length
 */

/**
 * Simple Hash function which generates value in range - [0, arraySize)
 *
 * Not an ideal solution - as Time Complexity is not O(1)
 * Time taken is O(n) where n is size of string
 */
function hash(str, arraySize = 999) {
    let total = 0
    for (let i in str) {
        total += str.charCodeAt(i)
    }
    return total % arraySize
}

// console.log(hash('pink', 111))
// console.log(hash('orange', 111))
// console.log(hash('blue', 111))

/**
 * Hash Table Class
 *
 * Separate Chaining:
 *      Key Collision happens. So, chain multiple values at 1 index
 *      Sample Chained Value for key - [ ['key1', 'value1'], ['key2', 'value2']]
 *
 * Table size A Prime Number
 *      Details - https://programming.guide/prime-numbers-in-hash-tables.html
 *
 */
class HashTable {
    constructor(size = 191) {
        // this.keyMap = new Array(size).fill([]) - // All elements are filled with a reference to the same empty array
        this.keyMap = []
        for (let i = 0; i < size; i++) {
            this.keyMap.push([])
        }
    }

    _hash(key) {
        let total = 0
        let PRIME = 31 // Prime no reduces collisions
        for (let i = 0; i < Math.min(100, key.length); i++) {
            let value = key.charCodeAt(i)

            // Modulo operation with each addition keeps the running total within the bounds
            // of the hash table's size, avoiding excessively large numbers
            // that could degrade performance
            total = (total * PRIME + value) % this.keyMap.length
        }
        return total
    }

    set(key, value) {
        const index = this._hash(key)

        const arrayAtIndex = this.keyMap[index]

        if (!arrayAtIndex.length) {
            // Empty Array
            arrayAtIndex.push([key, value])
        } else {
            let newPair = true
            for (let pair of arrayAtIndex) {
                if (pair[0] === key) {
                    // Key already exists. Updating value
                    pair[1] = value
                    newPair = false
                    break
                }
            }
            // If new pair, add
            if (newPair) arrayAtIndex.push([key, value])
        }
    }

    get(key) {
        const index = this._hash(key)
        const arrayAtIndex = this.keyMap[index]

        let value = null
        for (let pair of arrayAtIndex) {
            if (pair[0] === key) {
                value = pair[1]
                break
            }
        }
        return value
    }

    delete(key) {
        const index = this._hash(key)
        const arrayAtIndex = this.keyMap[index]

        let value = null
        for (let i = 0; i < arrayAtIndex.length; i++) {
            let pair = arrayAtIndex[i]
            if (pair[0] === key) {
                value = pair[1]
                arrayAtIndex.splice(i, 1)
                break
            }
        }
        return value
    }

    print() {
        console.log(this.keyMap)
    }

    keys() {
        const keyList = []
        for (let list of this.keyMap) {
            for (let pair of list) keyList.push(pair[0])
        }
        return keyList
    }

    values() {
        const valueList = []
        for (let list of this.keyMap) {
            for (let pair of list) {
                // Avoid Duplicate Values
                if (!valueList.includes(pair[1])) {
                    valueList.push(pair[1])
                }
            }
        }
        return valueList
    }
}

const ht = new HashTable(7)
ht.print()
ht.set('pink', 1)
// ht.set('blue', 1)
ht.set('green', 1)
ht.set('red', 1)
ht.set('rose', 1)
ht.set('cyan', 1)
ht.set('orange', 1)

// Update examples
ht.set('pink', 4)
ht.set('green', 5)

ht.print()

console.log(`Value at pink: ${ht.get('pink')}`)

// Test - Empty Array at index 1
console.log(`Value at brown: ${ht.get('brown')}`)

// Test - Blue shares index with pink. But value does not exists.
console.log(`Value at blue: ${ht.get('blue')}`) // if added, shares array with pink & green

console.log(`Keys in HashTable: ${ht.keys()}`)
console.log(`Values in HashTable: ${ht.values()}`)

console.log(`Deleting rose: ${ht.delete('rose')}`)
ht.print()
