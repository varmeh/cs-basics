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
 */

const redis = require('redis')

class PrefixHashTree {
    constructor() {
        this.client = redis.createClient()

        this.client.on('error', err => {
            console.error('Error connecting to Redis:', err)
        })
    }

    /**
     * Adds a word to the sorted sets for each of its prefixes
     * @param {string} word - The word to add
     * @param {number} frequency - The frequency of the word
     */
    addWord(word, frequency) {
        // Iterate through each prefix of the word
        for (let i = 1; i <= word.length; i++) {
            const prefix = word.slice(0, i) // Get the current prefix
            const key = `prefix:${prefix}` // Generate the Redis key for the prefix

            // Add the word to the sorted set for the current prefix with the given frequency
            this.client.zadd(key, frequency, word, err => {
                if (err) {
                    console.error('Error adding word to sorted set:', err)
                }
            })
        }
    }

    /**
     * Updates the frequency of a word in the sorted sets for each of its prefixes
     * @param {string} word - The word to update
     * @param {number} frequency - The new frequency of the word
     */
    updateFrequency(word, frequency) {
        // Iterate through each prefix of the word
        for (let i = 1; i <= word.length; i++) {
            const prefix = word.slice(0, i) // Get the current prefix
            const key = `prefix:${prefix}` // Generate the Redis key for the prefix

            // Update the word's frequency in the sorted set for the current prefix
            this.client.zadd(key, frequency, word, err => {
                if (err) {
                    console.error('Error updating word frequency in sorted set:', err)
                }
            })
        }
    }

    /**
     * Gets the top k suggestions for a given prefix
     * @param {string} prefix - The prefix to get suggestions for
     * @param {number} k - The number of top suggestions to return
     * @param {function} callback - The callback function to handle the result
     */
    getSuggestions(prefix, k, callback) {
        const key = `prefix:${prefix}` // Generate the Redis key for the prefix

        // Retrieve the top k suggestions from the sorted set for the given prefix
        this.client.zrevrange(key, 0, k - 1, 'WITHSCORES', (err, result) => {
            if (err) {
                console.error('Error getting suggestions from sorted set:', err)
                return callback(err, null)
            }

            // Process the results and format them as an array of suggestions
            const suggestions = []
            for (let i = 0; i < result.length; i += 2) {
                suggestions.push({ word: result[i], frequency: parseInt(result[i + 1], 10) })
            }
            callback(null, suggestions) // Call the callback with the suggestions
        })
    }
}

// Usage example
const prefixHashTree = new PrefixHashTree()
prefixHashTree.addWord('car', 5)
prefixHashTree.addWord('cat', 3)
prefixHashTree.addWord('cart', 4)
prefixHashTree.addWord('carbon', 2)

prefixHashTree.updateFrequency('car', 7)

prefixHashTree.getSuggestions('ca', 3, (err, suggestions) => {
    if (err) {
        console.error('Error getting suggestions:', err)
    } else {
        console.log('Top suggestions for "ca":', suggestions)
    }
})
