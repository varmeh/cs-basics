/**
 * Reference Implementation
 */

const express = require('express')
const Redis = require('ioredis')
const redis = new Redis() // Configure Redis with your cluster setup if needed

const app = express()
app.use(express.json())

const RATE_LIMIT_WINDOW = 60000 // 1 minute in milliseconds
const RATE_LIMIT_COUNT = 100 // Allow 100 requests per minute

async function isRateLimited(userId) {
    const currentTime = Date.now()
    const windowStart = currentTime - RATE_LIMIT_WINDOW
    const userKey = `rate_limiter:${userId}`

    // Remove outdated logs
    await redis.zremrangebyscore(userKey, 0, windowStart)

    // Log the new request - zadd(<key-for-sorted-list>, <score>, <member>)
    await redis.zadd(userKey, currentTime, currentTime)

    // Get the current count of requests in the window
    const requestCount = await redis.zcard(userKey)

    return requestCount <= RATE_LIMIT_COUNT
}

app.post('/rateLimit', async (req, res) => {
    const { userId } = req.body

    if (!userId) {
        return res.status(400).send('User ID is required')
    }

    const isLimited = await isRateLimited(userId)

    if (isLimited) {
        res.status(429).send('Too Many Requests')
    } else {
        res.status(200).send('Request Allowed')
    }
})

app.listen(3000, () => {
    console.log('Rate Limiter Service listening on port 3000')
})
