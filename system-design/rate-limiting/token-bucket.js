const express = require('express')

const app = express()
const port = 3000

// Create an instance of the TokenBucketRateLimiter with desired settings
const rateLimiter = new TokenBucketRateLimiter({
    refillRate: 1, // Refill 1 token per second
    bucketCapacity: 5 // Bucket capacity of 5 tokens
})

// Use the rate limiter middleware for the /rate-limit endpoint
app.get('/rate-limit', async (req, res) => {
    const { userId } = req.query // Assuming userId is passed as a query parameter

    if (!userId) {
        return res.status(400).send('User ID is required')
    }

    const allowed = await rateLimiter.limit(userId)

    if (!allowed) {
        return res.status(429).json({ message: 'Too Many Requests' })
    }

    res.json({ message: 'Request accepted' })
})

// Start the server
app.listen(port, () => {
    console.log(`Rate limiting server running at http://localhost:${port}`)
})

/** ------------- Token Bucket Implementation ------------------------ */

const redis = require('redis')
const { promisify } = require('util')

// Create and configure a Redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})

// Promisify Redis methods for using async/await
const getAsync = promisify(redisClient.get).bind(redisClient)
const setAsync = promisify(redisClient.set).bind(redisClient)

// Token Bucket Rate Limiter Class
class TokenBucketRateLimiter {
    constructor({ refillRate, bucketCapacity }) {
        this.refillRate = refillRate // Tokens added per interval (per second)
        this.bucketCapacity = bucketCapacity // Maximum number of tokens in the bucket
        this.bucketKeyPrefix = 'token_bucket_' // Redis key prefix for token buckets
    }

    // Method to get the current timestamp in seconds
    getCurrentTimestamp() {
        return Math.floor(Date.now() / 1000)
    }

    // Method to get the rate limiter key for a user
    getBucketKey(userId) {
        return `${this.bucketKeyPrefix}${userId}`
    }

    // Method to get the token bucket for a user
    async getTokenBucket(userId) {
        const bucketKey = this.getBucketKey(userId)
        const bucketData = await getAsync(bucketKey)

        if (!bucketData) {
            // If no bucket data exists, initialize the bucket
            return {
                tokens: this.bucketCapacity,
                lastRefillTimestamp: this.getCurrentTimestamp()
            }
        }

        return JSON.parse(bucketData)
    }

    // Method to save the token bucket for a user
    async saveTokenBucket(userId, bucket) {
        const bucketKey = this.getBucketKey(userId)
        await setAsync(bucketKey, JSON.stringify(bucket))
    }

    // Method to check if request allowed
    // This method merges check & refill into one
    // In this case, refill is done only when new request is received. It could be done independently as well
    async limit(userId) {
        const bucket = await getTokenBucket(userId)
        const currentTimestamp = getCurrentTimestamp()

        // Calculate time since last refill
        const elapsedTime = currentTimestamp - bucket.lastRefillTimestamp

        // Calculate the number of tokens to add
        const newTokens = Math.min(this.bucketCapacity, bucket.tokens + elapsedTime * this.refillRate)

        // Update the bucket with new tokens and timestamp
        bucket.tokens = newTokens
        bucket.lastRefillTimestamp = currentTimestamp

        let serviceRequest = false
        if (bucket.tokens > 1) {
            // Deduct 1 token to serve this request
            bucket.tokens -= 1
            serviceRequest = true
        }
        // Save the updated bucket
        await saveTokenBucket(userId, bucket)

        return serviceRequest
    }
}
