class Node {
    constructor(value, next = null, prev = null) {
        this.value = value
        this.next = next
        this.prev = prev
    }
}

class DLL {
    constructor() {
        this.head = null
        this.tail = null
        this.length = 0
    }

    // Insert at the end - O(1)
    push(val) {
        const node = new Node(val)

        if (!this.head) {
            // Empty list
            this.head = node
        } else {
            this.tail.next = node
            node.prev = this.tail
        }
        this.tail = node
        this.length++
    }

    // Remove at the end - O(1)
    pop() {
        // Empty list
        if (!this.head) return null

        const poppedNode = this.tail
        if (this.length == 1) {
            this.head = null
            this.tail = null
        } else {
            this.tail = poppedNode.prev
            this.tail.next = null
            poppedNode.prev = null // santization only
        }
        this.length--
        return poppedNode.value
    }

    // Insert at the begining - O(1)
    unshift(val) {
        const node = new Node(val)

        if (!this.head) {
            // Empty list
            this.tail = node
        } else {
            node.next = this.head
            this.head.prev = node
        }
        this.head = node
        this.length++
    }

    // Remove from start - O(1)
    shift() {
        // Empty list
        if (!this.head) return null

        const shiftedNode = this.head
        if (this.length == 1) {
            this.head = null
            this.tail = null
        } else {
            this.head = shiftedNode.next
            this.head.prev = null
            shiftedNode.next = null //santization only
        }
        this.length--
        return shiftedNode.value
    }

    // Get node at position
    _getNodeAt(position) {
        if (position < 1 || position > this.length) return null

        let node = null
        // Check if position lies in 1st or 2nd half
        if (Math.floor(this.length / 2) >= position) {
            node = this.head
            let counter = position

            while (--counter) {
                node = node.next
            }
        } else {
            // Start traversal from tail
            node = this.tail
            let counter = this.length - position + 1

            while (--counter) {
                node = node.prev
            }
        }
        return node
    }

    // Return value at position
    get(position) {
        const node = this._getNodeAt(position)
        return node ? node.value : null
    }

    // Change value at position
    set(position, value) {
        const node = this._getNodeAt(position)
        if (!node) return false

        node.value = value
        return true
    }

    // Insert value at position
    insert(position, value) {
        if (position <= 0 || position > this.length) return false

        switch (position) {
            case 1:
                this.unshift(value)
                break

            case this.length:
                this.push(value)
                break

            default:
                const node = this._getNodeAt(position - 1)

                const newNode = new Node(value)
                newNode.next = node.next
                newNode.prev = node
                node.next = newNode
                this.length++
        }
        return true
    }

    // remove at position
    remove(position) {
        if (position <= 0 || position > this.length) return null

        switch (position) {
            case 1:
                return this.shift()

            case this.length:
                return this.pop()

            default:
                const node = this._getNodeAt(position - 1)
                const nodeRemoved = node.next

                node.next = nodeRemoved.next
                nodeRemoved.next.prev = node

                nodeRemoved.next = null
                nodeRemoved.prev = null

                this.length--
                return nodeRemoved.value
        }
        return true
    }

    // String Coversion - O(n)
    toString() {
        if (!this.head) {
            return 'List Empty'
        }
        let str = 'List:'
        for (let node = this.head; node; node = node.next) {
            str += ` ${node.value} ->`
        }
        return str.replace(/->$/, '')
    }

    // Printing List - O(n)
    print() {
        console.log(this.toString())
    }
}

const list = new DLL()
list.print()
list.push(':)')
list.push('Hello')
list.push('World')
list.print()
console.log(`Popped from end:${list.pop()}`)
console.log(`Popped from end:${list.pop()}`)
list.print()
console.log(`Popped from end:${list.pop()}`)
list.print()

list.unshift(':)')
list.unshift('Hello')
list.unshift('World')
list.print()
console.log(`Shifted from start:${list.shift()}`)
console.log(`Shifted from start:${list.shift()}`)
list.print()
console.log(`Shifted from start:${list.shift()}`)
list.print()

list.unshift('Ola')
list.unshift('Hello')
list.print()
list.push('friend')
list.push('pal')
list.unshift(':)')
list.print()
console.log(`Value at position 10: ${list.get(10)}`)
console.log(`Value at position 0: ${list.get(0)}`)
console.log(`Value at position 3: ${list.get(3)}`)
console.log(`Value at position 2: ${list.get(2)}`)
console.log(`Value at position 4: ${list.get(4)}`)

list.print()
console.log(`Inserting #1 at position 10: ${list.insert(10, '#1')}`)
console.log(`Inserting #0 at position 0: ${list.insert(0, '#0')}`)
console.log(`Inserting #1 at position 1: ${list.insert(1, '#1')}`)
console.log(`Inserting #end at position ${list.length}: ${list.insert(list.length, '#end')}`)
console.log(`Inserting #3 at position 3: ${list.insert(3, '#3')}`)
console.log(`Inserting #5 at position 7: ${list.insert(7, '#7')}`)
list.print()

console.log(`Removing at position 10: ${list.remove(10)}`)
console.log(`Removing at position 0: ${list.remove(0)}`)
console.log(`Removing at position 3: ${list.remove(3)}`)
console.log(`Removing at position 7: ${list.remove(7)}`)
console.log(`Removingnd at position ${list.length}: ${list.remove(list.length)}`)
console.log(`Removing at position 1: ${list.remove(1)}`)
list.print()
