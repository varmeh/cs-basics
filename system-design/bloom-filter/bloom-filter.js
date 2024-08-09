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
const { createClient } = require('redis') // Import Redis client
const crypto = require('crypto') // Import crypto module for hashing

const app = express()
app.use(express.json()) // Use JSON middleware to parse JSON request bodies

// Create a Redis client using the createClient method
const redisClient = createClient()

// Handle any Redis client errors
redisClient.on('error', err => console.log('Redis Client Error', err))

// Connect to Redis asynchronously
;(async () => {
    await redisClient.connect() // Connect the Redis client
})()

/**
 * Function to calculate Bloom filter parameters
 * @param {number} numUsers - The expected number of users
 * @param {number} fpr - The desired false positive rate (FPR)
 * @returns {object} - An object containing the Bloom filter size and number of hash functions
 */
function calculateBloomFilterParameters(numUsers, fpr) {
    const ln2Squared = Math.log(2) ** 2
    const size = Math.ceil(-(numUsers * Math.log(fpr)) / ln2Squared) // Calculate size of Bloom filter
    const numHashFunctions = Math.ceil((size / numUsers) * Math.log(2)) // Calculate the number of hash functions
    return { size, numHashFunctions }
}

// Bloom filter configuration object
let bloomFilter = {
    size: 0,
    numHashFunctions: 0,
    keys: [],
    setKey: ''
}

/**
 * Function to initialize the Bloom filter with given parameters
 * @param {number} numUsers - The expected number of users
 * @param {number} fpr - The desired false positive rate (FPR)
 */
function initBloomFilter(numUsers, fpr) {
    const { size, numHashFunctions } = calculateBloomFilterParameters(numUsers, fpr)
    bloomFilter.size = size // Set Bloom filter size
    bloomFilter.numHashFunctions = numHashFunctions // Set number of hash functions
    bloomFilter.keys = Array(numHashFunctions)
        .fill()
        .map((_, i) => `bf:key:${i}`) // Create Redis keys for each hash function
    bloomFilter.setKey = `bf:userset` // Set the key for the Bloom filter in Redis
}

/**
 * Function to hash a value with a given seed using SHA-256
 * @param {string} value - The value to hash
 * @param {string} seed - The seed for the hash function
 * @returns {number} - The hashed position within the Bloom filter
 */
function hashWithSeed(value, seed) {
    const hash = crypto.createHash('sha256') // Create a SHA-256 hash
    hash.update(seed + value) // Update the hash with the seed and value
    return parseInt(hash.digest('hex'), 16) % bloomFilter.size // Return the hash modulo the Bloom filter size
}

/**
 * Function to add a username to the Bloom filter
 * @param {string} username - The username to add
 */
async function addUsername(username) {
    for (let i = 0; i < bloomFilter.numHashFunctions; i++) {
        const position = hashWithSeed(username, i.toString()) // Calculate position for each hash function
        await redisClient.setBit(bloomFilter.setKey, position, 1) // Set the bit in the Bloom filter
    }
}

/**
 * Function to check if a username might be in the Bloom filter
 * @param {string} username - The username to check
 * @returns {Promise<boolean>} - Returns true if the username might be taken, false otherwise
 */
async function isUsernameTaken(username) {
    let isTaken = true
    for (let i = 0; i < bloomFilter.numHashFunctions; i++) {
        const position = hashWithSeed(username, i.toString()) // Calculate position for each hash function
        const bitValue = await redisClient.getBit(bloomFilter.setKey, position) // Get the bit from the Bloom filter
        if (bitValue === 0) {
            isTaken = false // If any bit is 0, the username is definitely not taken
            break
        }
    }
    return isTaken // Return true if all bits are set, indicating the username might be taken
}

// Initialize Bloom filter with example parameters
initBloomFilter(1000, 0.01) // Initialize with 100 users and 1% FPR

// API endpoint to add a username to the Bloom filter
app.post('/add', async (req, res) => {
    const { username } = req.body
    await addUsername(username) // Add the username to the Bloom filter
    res.status(200).send({ success: true }) // Send success response
})

// API endpoint to check if a username is taken
app.get('/check', async (req, res) => {
    const { username } = req.query
    const taken = await isUsernameTaken(username) // Check if the username might be taken
    res.status(200).send({ taken }) // Send response indicating whether the username is taken
})

// Start the Express server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`) // Log server start
})
