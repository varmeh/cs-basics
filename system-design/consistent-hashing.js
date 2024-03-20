const crypto = require('crypto')

class ConsistentHashing {
    constructor(shards, nodesPerShard = 100) {
        this.ring = new Map() // Used to map virtualNodeHash to shard
        this.shards = shards // List of shards/servers
        this.virtualNodesPerShard = nodesPerShard // Recommended to use 100-200 virtual nodes per shard

        this._modulo = 1000 // Size of the hash space or the number of slots in the ring. Usually 3 to 4 times to number of virtual nodes

        this.initializeRing()
        this._printStructures()
    }

    // Populates the hash ring with virtual nodes for each shard
    initializeRing() {
        this.shards.forEach(shard => {
            // Creates virtual nodes for each shard
            for (let i = 0; i < this.virtualNodesPerShard; i++) {
                // Generates a unique key for each virtual node
                const virtualNodeKey = `${shard}:${i}`

                // Computes the hash for the virtual node key
                const hash = this.hashFunction(virtualNodeKey)

                // console.log(`Virtual Node Key: ${virtualNodeKey}, Hash: ${hash}, Shard: ${shard}`)
                this.ring.set(hash, shard)
            }
        })

        // Stores the sorted list of hash values to facilitate lookup
        this.sortedHashes = Array.from(this.ring.keys()).sort((a, b) => a - b)
    }

    _printStructures() {
        // Code uses 2 DS for its implementation
        // 1. Map - ring. It is used to identify the shard for a given nodeHash value
        console.log('\nRing:')
        console.log('  <NodeHash: Shard Number>')
        this.ring.forEach((value, key) => {
            console.log(`  ${key}: ${value}`)
        })

        // 2. Array - sortedHashes. It is used to identify the virtualNode hash for a given keyHash value
        console.log(`\nSorted Virtual Node Hashes: ${this.sortedHashes}\n`)
    }

    hashFunction(key) {
        // Uses SHA-256 to hash the key and returns a 32-bit integer hash value
        const hash = crypto.createHash('sha256').update(key).digest('hex')
        const hashIntegerValue = parseInt(hash, 16) % this._modulo

        // console.log(`Key: ${key}, Hash: ${hash}, Hash Integer Value: ${hashIntegerValue}`)
        return hashIntegerValue
    }

    getShard(key) {
        const keyHash = this.hashFunction(key)

        // Now search for the first nodeHash in the sortedHashes array which is greater than or equal to keyHash
        const nodeIndex = this.sortedHashes.findIndex(nodeHash => keyHash <= nodeHash)

        // Wrap Around - Array.findIndex() -> -1 if keyHash is greator than all nodeHashes
        // In this case, it would be mapped to the first node
        // So, nodeHash would be 0 if nodeIndex is -1 else nodeIndex
        const nodeHash = this.sortedHashes[nodeIndex === -1 ? 0 : nodeIndex]

        // console.log(`Key: ${key}, Key Hash: ${keyHash}, Node Index: ${nodeIndex}, Node Hash: ${nodeHash}`)
        return this.ring.get(nodeHash)
    }
}

/*----------------- Demo Code -----------------*/

// Define shards
const shards = ['shard1', 'shard2', 'shard3']
const ch = new ConsistentHashing(shards, 10)

// Simulate adding URLs
const urls = ['url1', 'url2', 'url3', 'url4', 'url5']
urls.forEach(url => {
    const shard = ch.getShard(url)
    console.log(`URL ${url} is stored in ${shard}`)
})

// Simulate retrieving the same URLs to demonstrate consistent hashing
console.log('\nRetrieving URLs...')
urls.forEach(url => {
    const shard = ch.getShard(url)
    console.log(`URL ${url} is retrieved from ${shard}`)
})
