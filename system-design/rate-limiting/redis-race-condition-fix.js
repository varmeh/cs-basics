const redis = require('redis')
const client = redis.createClient()

/**
 * ACID in Redis
 * - Redis is an In-Memory store so, durability is NOT a usual expectations
 * - To achieve rest of ACID Transaction Properties,USE MULTI
 * - How Multi Works:
 *  - Queueing Commands - When MULTI is called, Redis starts queueing commands instead of executing them immediately
 *  - Atomic Execution - When EXEC is called, Redis executes all the queued commands in sequence as a single atomic operation
 *  - Isolation - During the execution of the MULTI block, Redis ensures no other commands are interleaved, maintaining isolation
 *  - Consistency -If any command in the MULTI block fails, the entire transaction is discarded, and none of the commands are applied
 *
 */

async function rateLimit(userId, limit, windowSize) {
    const now = Date.now()
    const windowStart = now - windowSize

    const key = `rate_limit:${userId}`

    // Start a transaction
    client
        .multi()
        // Remove timestamps older than the current window
        .zremrangebyscore(key, 0, windowStart)
        // Get the count of remaining timestamps
        .zcard(key)
        // Add the current timestamp
        .zadd(key, now, now)
        // Execute the transaction
        .exec((err, replies) => {
            if (err) {
                console.error('Transaction failed', err)
            } else {
                const requestCount = replies[1] // Result of zcard command
                if (requestCount > limit) {
                    console.log('Rate limit exceeded')
                } else {
                    console.log('Request allowed')
                }
            }
        })
}

// Usage example
rateLimit('user123', 10, 60000) // 10 requests per minute
