const crypto = require('crypto')

class BasicConsistentHashing {
    constructor() {
        this.ring = {}
        this.sortedKeys = []
        this.hashSpace = 1001 // division by this number limits hash space to 1000
    }

    hash(key) {
        const hash = crypto.createHash('sha256').update(key).digest('hex')

        // Division by hashspace is used only for demo
        // Not required in real world large scale apps
        const hashIntegerValue = parseInt(hash, 16) % this.hashSpace

        return hashIntegerValue
    }

    addNode(node) {
        const point = this.hash(node)
        this.ring[point] = node
        this.sortedKeys = Object.keys(this.ring)
            .map(Number)
            .sort((a, b) => a - b)
        console.log(`Node ${node} added at point ${point}`)
    }

    printNodeHashData() {
        console.log(`\nNode Ring Hash Order: ${this.sortedKeys}`)
        console.log('Mapping of Hash Space with nodes:', this.ring)
    }

    removeNode(node) {
        const point = this.hash(node)
        delete this.ring[point]
        this.sortedKeys = Object.keys(this.ring)
            .map(Number)
            .sort((a, b) => a - b)
        console.log(`Node ${node} removed from point ${point}`)
    }

    findNode(item) {
        const itemHash = this.hash(item)
        for (let nodeHash of this.sortedKeys) {
            if (nodeHash >= itemHash) {
                return this.ring[nodeHash]
            }
        }
        return this.ring[this.sortedKeys[0]] // Wrap around to the first node
    }
}

// Basic Consistent Hashing Demo
const basicHashRing = new BasicConsistentHashing()
basicHashRing.addNode('Node1')
basicHashRing.addNode('Node2')
basicHashRing.addNode('Node3')

basicHashRing.printNodeHashData()

console.log(`\nKey 'alpha' is managed by ${basicHashRing.findNode('alpha')}`)
console.log(`Key 'beta' is managed by ${basicHashRing.findNode('beta')}`)

console.log('\nRemove Node2')
basicHashRing.removeNode('Node2')
basicHashRing.printNodeHashData()

console.log(`\nKey 'alpha' is managed by ${basicHashRing.findNode('alpha')}`)
console.log(`Key 'beta' is managed by ${basicHashRing.findNode('beta')}`)

/* ---------------- Hashing With Virtual Nodes ------------------------------ */

class ConsistentHashingWithVNodes {
    constructor(vnodeCount = 100) {
        this.vnodeCount = vnodeCount
        this.ring = {}
        this.sortedKeys = []
        this.hashSpace = 1001 // division by this number limits hash space to 1000
    }

    hash(key) {
        const hash = crypto.createHash('sha256').update(key).digest('hex')

        // Division by hashspace is used only for demo
        // Not required in real world large scale apps
        const hashIntegerValue = parseInt(hash, 16) % this.hashSpace

        return hashIntegerValue
    }

    printNodeHashData() {
        console.log(`\nNode Ring Hash Order: ${this.sortedKeys}`)
        console.log('Mapping of Hash Space with nodes:', this.ring)
    }

    addNode(node) {
        for (let i = 0; i < this.vnodeCount; i++) {
            const virtualNode = `${node}#${i}`
            const point = this.hash(virtualNode)
            this.ring[point] = node
            console.log(`Virtual node ${virtualNode} added at point ${point}`)
        }
        this.sortedKeys = Object.keys(this.ring)
            .map(Number)
            .sort((a, b) => a - b)
    }

    findNode(key) {
        const itemHash = this.hash(key)
        for (let nodeHash of this.sortedKeys) {
            if (nodeHash >= itemHash) {
                return this.ring[nodeHash]
            }
        }
        return this.ring[this.sortedKeys[0]] // Wrap around to the first node
    }
}

// Consistent Hashing Demo with Virtual Nodes
const hashRingWithVNodes = new ConsistentHashingWithVNodes(5)
hashRingWithVNodes.addNode('Node1')
hashRingWithVNodes.addNode('Node2')
hashRingWithVNodes.addNode('Node3')

hashRingWithVNodes.printNodeHashData()

console.log(`\nKey 'alpha' is managed by ${hashRingWithVNodes.findNode('alpha')}`)
console.log(`Key 'beta' is managed by ${hashRingWithVNodes.findNode('beta')}`)
