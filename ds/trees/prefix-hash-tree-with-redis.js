/**
 * PrefixHashTree Class Implementation
 *
 * This class implements an autocomplete system using Redis sorted sets.
 * For each prefix of a word, it creates a sorted set where:
 * - The key of the sorted set is the prefix.
 * - The member of the sorted set is the word.
 * - The score of the sorted set is the frequency of the word.
 *
 * Features:
 * - Adding a word with a specific frequency.
 * - Updating the frequency of an existing word.
 * - Retrieving top-k autocomplete suggestions for a given prefix.
 *
 * The class uses Redis commands:
 * - ZADD: Adds a member to a sorted set with a specified score.
 * - ZREVRANGE: Returns the members of a sorted set in reverse order, from high to low scores.
 *
 * Reference - https://medium.com/@prefixyteam/how-we-built-prefixy-a-scalable-prefix-search-service-for-powering-autocomplete-c20f98e2eff1
 *
 *
 * Docker Setup Instructions for Testing:
 *
 * # Pull the Redis image from Docker Hub
 * docker pull redis
 *
 * # Run a Redis container
 * docker run --name redis-test -d -p 6379:6379 redis
 *
 * # Access Redis CLI to inspect stored data
 * docker exec -it redis-test redis-cli
 *
 * # List all keys
 * keys *
 *
 * # Inspect the contents of a key
 * zrange prefix:ca 0 -1 withscores
 *
 */

const redis = require('redis')

class PrefixHashTree {
    constructor() {
        this.client = redis.createClient()

        this.client.on('error', err => {
            console.error('Error connecting to Redis:', err)
        })

        // Connect the client
        this.client.connect()
    }

    /**
     * Adds a word to the sorted sets for each of its prefixes
     * @param {string} word - The word to add
     * @param {number} frequency - The frequency of the word
     */
    async addWord(word, frequency) {
        for (let i = 1; i <= word.length; i++) {
            const prefix = word.slice(0, i)
            const key = `prefix:${prefix}`

            try {
                await this.client.zAdd(key, {
                    score: frequency,
                    value: word
                })
            } catch (err) {
                console.error('Error adding word to sorted set:', err)
            }
        }
    }

    /**
     * Updates the frequency of a word in the sorted sets for each of its prefixes
     * @param {string} word - The word to update
     * @param {number} frequency - The new frequency of the word
     */
    async updateFrequency(word, frequency) {
        for (let i = 1; i <= word.length; i++) {
            const prefix = word.slice(0, i)
            const key = `prefix:${prefix}`

            try {
                await this.client.zAdd(key, {
                    score: frequency,
                    value: word
                })
            } catch (err) {
                console.error('Error updating word frequency in sorted set:', err)
            }
        }
    }

    /**
     * Gets the top k suggestions for a given prefix
     * @param {string} prefix - The prefix to get suggestions for
     * @param {number} k - The number of top suggestions to return
     * @param {function} callback - The callback function to handle the result
     */
    async getSuggestions(prefix, k) {
        const key = `prefix:${prefix}`

        try {
            const result = await this.client.zRangeWithScores(key, 0, k - 1, { REV: true })
            return result.map(({ value, score }) => ({
                word: value,
                frequency: score
            }))
        } catch (err) {
            console.error('Error getting suggestions from sorted set:', err)
            throw err
        }
    }
}

// Usage example
;(async () => {
    const prefixHashTree = new PrefixHashTree()
    await prefixHashTree.addWord('car', 5)
    await prefixHashTree.addWord('cat', 3)
    await prefixHashTree.addWord('cart', 4)
    await prefixHashTree.addWord('carbon', 2)

    await prefixHashTree.updateFrequency('car', 7)

    try {
        const suggestions = await prefixHashTree.getSuggestions('ca', 3)
        console.log('Top suggestions for "ca":', suggestions)
    } catch (err) {
        console.error('Error getting suggestions:', err)
    }
})()
