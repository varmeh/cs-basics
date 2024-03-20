class Node {
    constructor(value, next = null) {
        this._value = value
        this._next = next
    }

    get value() {
        return this._value
    }

    get next() {
        return this._next
    }

    setValue(newValue) {
        this._value = newValue
    }

    setNode(newNode) {
        this._next = newNode
    }
}

class SinglyLinkedList {
    constructor() {
        this._head = null
        this._tail = null
        this._length = 0
    }

    get length() {
        return this._length
    }

    // Insert at the end - O(1)
    push(val) {
        const node = new Node(val)

        if (!this._head) {
            // Head is null
            this._head = node
        } else {
            // Append to tail node
            this._tail.setNode(node)
        }
        this._tail = node
        this._length++
    }

    // Remove from end - O(n)
    pop() {
        // Empty List
        if (!this._head) return null

        const poppedNode = this._tail

        if (this.length == 1) {
            // Only 1 node
            this._head = null
            this._tail = null
        } else {
            // More than 1 node
            let node = this._head

            // Search node referencing to tail node
            while (node.next != poppedNode) {
                node = node.next
            }
            this._tail = node
            node.setNode(null)
        }
        this._length--
        return poppedNode.value
    }

    // Remove from begining - O(1)
    shift() {
        // Empty List
        if (!this._head) return null

        const valueRemoved = this._head.value
        if (this.length == 1) {
            this._head = null
            this._tail = null
        } else {
            // List with more than 2 elements
            this._head = this._head.next
        }
        this._length--
        return valueRemoved
    }

    // Insert at begining - O(1)
    unshift(val) {
        this._head = new Node(val, this._head)
        this._length++

        if (!this._tail) {
            // Empty List
            this._tail = this._head
        }
    }

    _getNodeAt(position) {
        if (position <= 0 || position > this._length) return null
        let i = position
        let node = this._head
        while (--i) {
            node = node.next
        }
        return node
    }

    // Get item at position - O(n)
    get(position) {
        const node = this._getNodeAt(position)
        return node ? node.value : null
    }

    // Change value at position - O(n)
    set(position, value) {
        const node = this._getNodeAt(position)
        if (!node) return false
        node.setValue(value)
        return true
    }

    // Insert value at position - O(n)
    insert(position, value) {
        if (position <= 0 || position > this._length) return false

        switch (position) {
            case 1:
                this.unshift(value)
                break

            case this.length:
                this.push(value)
                break

            default:
                // Get node at position-1
                const priorNode = this._getNodeAt(position - 1)

                // Node will point to newNode & newNode will point to current node.next
                const newNode = new Node(value, priorNode.next)
                priorNode.setNode(newNode)
                this._length++
                break
        }
        return true
    }

    // Remove at position - O(n)
    remove(position) {
        if (position <= 0 || position > this._length) return null

        switch (position) {
            case 1:
                return this.shift()

            case this.length:
                return this.pop()

            default:
                // Get node at position-1
                const priorNode = this._getNodeAt(position - 1)

                const nodeRemoved = priorNode.next
                priorNode.setNode(nodeRemoved.next)
                this._length--
                return nodeRemoved.value
        }
    }

    // Reverse the list - O(n)
    reverse() {
        // When length == 0 or length == 1
        if (this.length < 2) return

        this._tail = this._head
        let tempHead = null
        let curNode = this._head
        let nextNodeInList = null
        while (curNode) {
            nextNodeInList = curNode.next
            curNode.setNode(tempHead)
            tempHead = curNode
            curNode = nextNodeInList
        }

        this._head = tempHead
    }

    // String Coversion - O(n)
    toString() {
        if (!this._head) {
            return 'List Empty'
        }
        let str = 'List:'
        for (let node = this._head; node; node = node.next) {
            str += ` ${node.value} ->`
        }
        return str.replace(/->$/, '')
    }

    // Printing List - O(n)
    print() {
        console.log(this.toString())
    }
}

const list = new SinglyLinkedList()
list.print()

list.push(10)
list.push(20)
list.push(30)
list.push(40)
list.print()
// console.log(list)

console.log(`Popped from end:${list.pop()}`)
list.print()
console.log(`Shifted from start: ${list.shift()}`)
list.print()
console.log(`Shifted from start: ${list.shift()}`)
console.log(`Popped from end:${list.pop()}`)
list.print()
console.log(`Popped from end:${list.pop()}`)
console.log(`Shifted from start: ${list.shift()}`)

list.unshift('Ola')
list.unshift('Hello')
list.print()
console.log(list)
list.push('friend')
console.log(list)
list.push('pal')
list.unshift(':)')
list.print()
console.log(`Value at position 10: ${list.get(10)}`)
console.log(`Value at position 4: ${list.get(4)}`)
list.set(4, list.get(4) + '!!!')
list.print()

console.log(`Inserting $$ at position 10: ${list.insert(10, '$$')}`)
console.log(`Inserting $$ at position 1: ${list.insert(1, '$$')}`)
console.log(`Inserting ~~ at position ${list.length}: ${list.insert(list.length, '~~')}`)
console.log(`Inserting && at position ${list.length - 2}: ${list.insert(list.length - 2, '&&')}`)
list.print()

console.log(`Removing at position 10: ${list.remove(10)}`)
console.log(`Removing at position -1: ${list.remove(-1)}`)
console.log(`Removing at position 1: ${list.remove(1)}`)
console.log(`Removing at position ${list.length - 2}: ${list.remove(list.length - 2)}`)
console.log(`Removing at position ${list.length}: ${list.remove(list.length)}`)
console.log(list)
list.print()

list.reverse()
list.print()
list.reverse()
list.print()
