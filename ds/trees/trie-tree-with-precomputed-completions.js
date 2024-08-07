/**
 * Trie Tree with pre-computed, pre-sorted completions
 * - Completions are added to each parent node in sorted order
 * - Essentially, completions are added & updated on addition or updation of a word & word frequency respectively
 * - This enables read query time of O(p), where p is length of prefix
 */

class TrieNode {
    constructor() {
        this.children = {} // Each node stores its children in a dictionary
        this.isEndOfWord = false // Indicates if the node represents the end of a word
        this.frequency = 0 // Stores the frequency of the word ending at this node
        this.sortedCompletions = [] // Stores completions in sorted order by frequency
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode() // Initialize the Trie with a root node
    }

    /**
     * Adds a word to the Trie with the specified frequency
     * @param {string} word - The word to be added
     * @param {number} frequency - The frequency of the word
     *
     *
     */
    addWord(word, frequency = 1) {
        let currentNode = this.root
        for (const char of word) {
            if (!currentNode.children[char]) {
                currentNode.children[char] = new TrieNode()
            }
            currentNode = currentNode.children[char]
            // Add current word to the completions list
            this._addCompletion(currentNode, word, frequency)
        }
        currentNode.isEndOfWord = true
        currentNode.frequency = frequency
    }

    /**
     * Updates the frequency of an existing word in the Trie
     * @param {string} word - The word to update the frequency
     * @param {number} frequency - The new frequency of the word
     * @returns {boolean} - Returns true if the word was found and updated, otherwise false
     *
     * Calculating O(n) Time comlexity
     *  - Travesing the word - For each character in the word, the method traverses the Trie, which takes O(n) where n is length of Word
     *  - Add word to sorted completion
     *    - For each character, the _addCompletion method is called
     *     - Find existing word: This takes O(m) time, where m is the number of completions at the current node
     *     - Insert & Sort: nserting the new word and sorting the completions list takes O(mlogm) time.
     *    So, for each character in the word, we perform O(mlogm) operations to maintain the sorted completions
     * If the average number of completions is m and the word length is n, the overall time complexity is: O(n⋅(mlogm))
     */
    updateFrequency(word, frequency) {
        let currentNode = this.root
        for (const char of word) {
            if (!currentNode.children[char]) {
                return false // Word not found
            }
            currentNode = currentNode.children[char]
        }
        if (currentNode.isEndOfWord) {
            currentNode.frequency = frequency
            // Update the completion list with the new frequency
            this._addCompletion(this.root, word, frequency)
            return true
        }
        return false // Word not found
    }

    /**
     * Returns the top k suggestions based on frequency for the given prefix
     * @param {string} prefix - The prefix to search for suggestions
     * @param {number} k - The number of top suggestions to return
     * @returns {string[]} - An array of top k suggestions
     */
    suggestions(prefix, k = 3) {
        let currentNode = this.root
        for (const char of prefix) {
            if (!currentNode.children[char]) {
                return [] // Prefix not found
            }
            currentNode = currentNode.children[char]
        }
        return currentNode.sortedCompletions.slice(0, k).map(suggestion => suggestion.word)
    }

    /**
     * Adds a word to the completion list of a node while maintaining sorted order
     * @param {TrieNode} node - The current Trie node
     * @param {string} word - The word to add to the completions list
     * @param {number} frequency - The frequency of the word
     */
    _addCompletion(node, word, frequency) {
        let completions = node.sortedCompletions
        let index = completions.findIndex(entry => entry.word === word)
        if (index !== -1) {
            completions.splice(index, 1) // Remove existing word if found
        }
        completions.push({ word, frequency })
        completions.sort((a, b) => b.frequency - a.frequency) // Sort by frequency in descending order

        // Maintain only unique completions
        node.sortedCompletions = completions.filter((entry, idx, self) => idx === self.findIndex(e => e.word === entry.word))
    }
}

// Usage example
const trie = new Trie()
trie.addWord('apple', 5)
trie.addWord('app', 3)
trie.addWord('apricot', 4)
trie.addWord('april', 10)
trie.addWord('apprisal', 12)
trie.addWord('banana', 2)
trie.addWord('application', 6)

console.log(trie.suggestions('app')) // ["apprisal", "application", "apple"]
trie.updateFrequency('app', 7)
console.log(trie.suggestions('app')) // ["app", "apprisal", "application"]
console.log(trie.suggestions('ap', 4)) // ["apprisal", "april", "application", "apricot"]
