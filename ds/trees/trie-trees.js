// Reference Tutorial for trie - https://medium.com/@prefixyteam/how-we-built-prefixy-a-scalable-prefix-search-service-for-powering-autocomplete-c20f98e2eff1

class TrieNode {
    constructor() {
        // Each node stores its children in a dictionary
        this.children = {}
        // Indicates if the node represents the end of a word
        this.isEndOfWord = false
        // Stores the frequency of the word ending at this node
        this.frequency = 0
    }
}

class Trie {
    constructor() {
        // Initialize the Trie with a root node
        this.root = new TrieNode()
    }

    // Adds a word to the Trie with the specified frequency
    addWord(word, frequency = 1) {
        let currentNode = this.root
        for (const char of word) {
            // If the character is not already a child, create a new TrieNode
            if (!currentNode.children[char]) {
                currentNode.children[char] = new TrieNode()
            }
            // Move to the child node
            currentNode = currentNode.children[char]
        }
        // Mark the end of the word and set the frequency
        currentNode.isEndOfWord = true
        currentNode.frequency = frequency
    }

    // Updates the frequency of an existing word in the Trie
    updateFrequency(word, frequency) {
        let currentNode = this.root
        for (const char of word) {
            // If the character is not found, the word does not exist in the Trie
            if (!currentNode.children[char]) {
                return false // Word not found
            }
            // Move to the child node
            currentNode = currentNode.children[char]
        }
        // Update the frequency if the word exists
        if (currentNode.isEndOfWord) {
            currentNode.frequency = frequency
            return true
        }
        return false // Word not found
    }

    // Returns the top 3 suggestions based on frequency for the given prefix
    suggestions(prefix, k = 3) {
        let currentNode = this.root
        for (const char of prefix) {
            // If the prefix is not found, return an empty list
            if (!currentNode.children[char]) {
                return [] // Prefix not found
            }

            // Move to the child node
            currentNode = currentNode.children[char]
        }

        // Collect all words starting from the current node
        let completions = []
        this._dfs(currentNode, prefix, completions)

        // Sort completions by frequency in descending order
        completions.sort((a, b) => b.frequency - a.frequency)

        // Return the top k completions as suggestions
        return completions.slice(0, k).map(suggestion => suggestion.word)
    }

    // Helper method to perform a depth-first search to collect all words
    _dfs(node, currentWord, completions) {
        // If the node represents the end of a word, add it to the completions
        if (node.isEndOfWord) {
            completions.push({ word: currentWord, frequency: node.frequency })
        }

        // Recursively visit all child nodes
        for (const char in node.children) {
            this._dfs(node.children[char], currentWord + char, completions)
        }
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

console.log(trie.suggestions('app')) // ["application", "apple", "app"]
trie.updateFrequency('app', 7)
console.log(trie.suggestions('app')) // ["app", "application", "apple"]
console.log(trie.suggestions('ap', 4))
