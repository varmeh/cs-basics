const express = require('express')

const app = express()
const port = 3000

// Create an instance of the LeakyBucketRateLimiter with desired settings
const rateLimiter = new LeakyBucketRateLimiter({
    queueSize: 10, // Maximum 10 requests in the queue
    processingInterval: 1000 // Process requests every 1 second
})

// Use the rate limiter middleware for the /rate-limit endpoint
app.get('/rate-limit', rateLimiter.rateLimiterMiddleware())

// Start the server
app.listen(port, () => {
    console.log(`Rate limiting server running at http://localhost:${port}`)
})

/** --------------------- Leaky Bucket Implementation --------------------- */

const redis = require('redis')
const { promisify } = require('util')
const uuid = require('uuid')

// Create and configure a Redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})

// Create a separate Redis client for Pub/Sub
const pubSubClient = redis.createClient({
    host: 'localhost',
    port: 6379
})

// Promisify Redis methods for using async/await
const lpushAsync = promisify(redisClient.lpush).bind(redisClient)
const rpopAsync = promisify(redisClient.rpop).bind(redisClient)
const llenAsync = promisify(redisClient.llen).bind(redisClient)

// Leaky Bucket Rate Limiter Class
class LeakyBucketRateLimiter {
    constructor({ queueSize, processingInterval }) {
        this.queueSize = queueSize // Maximum capacity of the queue
        this.processingInterval = processingInterval // Interval to process queued requests (ms)
        this.queueKey = 'rate_limiter_queue' // Redis key for the request queue
        this.pendingRequests = new Map() // Map to store pending requests

        // Start processing the queue at regular intervals
        this.startProcessingQueue()

        // Set up Redis Pub/Sub for processing confirmation
        this.setupPubSub()
    }

    /**
     * Queue Processing (startProcessingQueue method):
     *  - A setInterval function is set to run every processingInterval milliseconds.
     *  - It pops the next request ID from the Redis queue using rpopAsync.
     *  - If a request ID is found, it publishes a message to the processed_requests channel indicating that the request has been processed.
     */
    startProcessingQueue() {
        setInterval(async () => {
            // Get the next request ID from the queue
            const requestId = await rpopAsync(this.queueKey)
            if (requestId) {
                console.log(`Processing request ${requestId}`)
                // Notify that the request has been processed
                pubSubClient.publish('processed_requests', requestId)
            }
        }, this.processingInterval)
    }

    /**
     * Setting up Pub/Sub (setupPubSub method):
     * - The Pub/Sub client subscribes to the processed_requests channel
     * - When a message is received on the processed_requests channel, it checks if there is a pending request with the corresponding ID in the pendingRequests map.
     * - If found, it resolves the promise associated with that request ID and removes the entry from the pendingRequests map
     */
    setupPubSub() {
        pubSubClient.subscribe('processed_requests')
        pubSubClient.on('message', (channel, message) => {
            if (channel === 'processed_requests') {
                // Resolve the promise for the processed request
                const resolve = this.pendingRequests.get(message)
                if (resolve) {
                    resolve()
                    // Remove the request from the pending map
                    this.pendingRequests.delete(message)
                }
            }
        })
    }

    // Middleware to handle rate limiting
    rateLimiterMiddleware() {
        return async (req, res, next) => {
            // Check the current size of the queue
            const queueSize = await llenAsync(this.queueKey)

            if (queueSize >= this.queueSize) {
                // If the queue is full, return a 429 Too Many Requests response
                return res.status(429).send('Too Many Requests')
            }

            // Generate a unique ID for the request
            const requestId = uuid.v4()

            // Add the request to the queue
            await lpushAsync(this.queueKey, requestId)

            // Create a promise to wait for the processing confirmation
            const requestPromise = new Promise(resolve => {
                this.pendingRequests.set(requestId, resolve)
            })

            // Wait for the request to be processed
            await requestPromise

            // Send a 200 OK response
            res.status(200).send('Request processed')
        }
    }
}
