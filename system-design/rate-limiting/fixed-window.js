const express = require('express')
const redis = require('redis')
const { promisify } = require('util')

const app = express()
const port = 3000

// Create a Redis client
const client = redis.createClient()

// Promisify Redis methods for async/await usage
const incrAsync = promisify(client.incr).bind(client)
const expireAsync = promisify(client.expire).bind(client)
const getAsync = promisify(client.get).bind(client)

// Define rate limiting constants
const RATE_LIMIT_WINDOW = 60 // 1 minute in seconds
const RATE_LIMIT_COUNT = 100 // Max requests per window

/**
 * Function to check if a user is rate-limited
 * @param {string} userId - The ID of the user making the request
 * @returns {boolean} - Whether the user is rate-limited
 */
async function isRateLimited(userId) {
    // Create a Redis key based on user ID and the current window timestamp
    const key = `rate_limit:${userId}:${Math.floor(Date.now() / 1000 / RATE_LIMIT_WINDOW)}`

    // Increment the request count for the current window
    const requestCount = await incrAsync(key)

    // If this is the first request in the current window, set the expiration for the key
    if (requestCount === 1) {
        await expireAsync(key, RATE_LIMIT_WINDOW)
    }

    // Check if the request count exceeds the allowed limit
    return requestCount <= RATE_LIMIT_COUNT
}

// Define a route for the API endpoint
app.get('/api', async (req, res) => {
    const userId = req.query.userId

    // Check if userId query parameter is provided
    if (!userId) {
        return res.status(400).send('userId query parameter is required')
    }

    // Check if the user is rate-limited
    const limited = await isRateLimited(userId)

    // Respond with 429 if the user is rate-limited
    if (limited) {
        return res.status(429).send('Rate limit exceeded')
    }

    // Respond with success message if the user is not rate-limited
    res.send('Request successful')
})

// Start the Express server
app.listen(port, () => {
    console.log(`Rate limiter service running on port ${port}`)
})
