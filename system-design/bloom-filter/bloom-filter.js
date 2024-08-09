/**
 * Bloom Filter Implementation using Express.js and Redis
 *
 * Description:
 * This file contains the implementation of a Bloom filter using Express.js and Redis. The Bloom filter is used to
 * efficiently check if a username has already been taken during user registration. This implementation allows for
 * dynamic initialization of the Bloom filter with custom false positive rate (FPR) and number of expected users.
 *
 * Features:
 * - Dynamically initialize the Bloom filter based on FPR and expected number of users.
 * - Add usernames to the Bloom filter.
 * - Check if a username is potentially taken (with a small false positive probability).
 *
 * Dependencies:
 * - express: A web framework for Node.js.
 * - redis: A Redis client for Node.js.
 * - crypto: A module providing cryptographic functionalities (for hashing).
 *
 * API Endpoints:
 * 1. POST /add
 *    - Add a username to the Bloom filter.
 *    - Request Body: { "username": <string> }
 *    - Example: { "username": "john_doe" }
 *
 * 2. GET /check
 *    - Check if a username is potentially taken.
 *    - Query Parameter: username=<string>
 *    - Example: /check?username=john_doe
 *
 * How to Run:
 * 1. Ensure Redis is running (instructions provided below to run Redis using Docker).
 * 2. Start the Express.js server using: `node server.js`.
 * 3. Use the provided API endpoints to interact with the Bloom filter.
 *
 * Testing with Docker Redis:
 * 1. Run Redis in a Docker container using:
 *    `docker run --name redis-bloom -p 6379:6379 -d redis`
 * 2. Start the Express.js server.
 * 3. Test the API using tools like `curl`, `Postman`, or any HTTP client.
 *
 * Author: [Your Name]
 * Date: [Date]
 */

const express = require('express')
const redis = require('redis')
const crypto = require('crypto')

const app = express()
app.use(express.json())

const redisClient = redis.createClient()

// Function to calculate Bloom filter size and number of hash functions
function calculateBloomFilterParameters(numUsers, fpr) {
    const ln2Squared = Math.log(2) ** 2
    const size = Math.ceil(-(numUsers * Math.log(fpr)) / ln2Squared)
    const numHashFunctions = Math.ceil((size / numUsers) * Math.log(2))
    return { size, numHashFunctions }
}

// Initialize the Bloom filter
let bloomFilter = {
    size: 0,
    numHashFunctions: 0,
    keys: [],
    setKey: ''
}

function initBloomFilter(numUsers, fpr) {
    const { size, numHashFunctions } = calculateBloomFilterParameters(numUsers, fpr)
    bloomFilter.size = size
    bloomFilter.numHashFunctions = numHashFunctions
    bloomFilter.keys = Array(numHashFunctions)
        .fill()
        .map((_, i) => `bf:key:${i}`)
    bloomFilter.setKey = `bf:userset`

    // Initialize the bitmap in Redis (optional if you want to explicitly set size)
    redisClient.setbit(bloomFilter.setKey, size - 1, 0)
}

// Hash function generator
function hashWithSeed(value, seed) {
    const hash = crypto.createHash('sha256')
    hash.update(seed + value)
    return parseInt(hash.digest('hex'), 16) % bloomFilter.size
}

// Add a username to the Bloom filter
function addUsername(username) {
    for (let i = 0; i < bloomFilter.numHashFunctions; i++) {
        const position = hashWithSeed(username, i.toString())
        redisClient.setbit(bloomFilter.setKey, position, 1)
    }
}

// Check if a username might be in the Bloom filter
function isUsernameTaken(username, callback) {
    let bitChecks = []
    for (let i = 0; i < bloomFilter.numHashFunctions; i++) {
        const position = hashWithSeed(username, i.toString())
        bitChecks.push(['getbit', bloomFilter.setKey, position])
    }
    redisClient.multi(bitChecks).exec((err, replies) => {
        if (err) {
            callback(false)
        } else {
            callback(replies.every(bit => bit === 1))
        }
    })
}

// Initialize Bloom filter with example parameters
initBloomFilter(100, 0.1)

// API to add a username
app.post('/add', (req, res) => {
    const { username } = req.body
    addUsername(username)
    res.status(200).send({ success: true })
})

// API to check if a username is taken
app.get('/check', (req, res) => {
    const { username } = req.query
    isUsernameTaken(username, isTaken => {
        res.status(200).send({ taken: isTaken })
    })
})

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
