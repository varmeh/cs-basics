// Reference Tutorial for trie - https://medium.com/@prefixyteam/how-we-built-prefixy-a-scalable-prefix-search-service-for-powering-autocomplete-c20f98e2eff1

class TrieNode {
    constructor() {
        this.children = {} // To store child nodes
        this.isEndOfWord = false // To mark the end of a word
        this.frequency = 0 // To store the frequency of the word
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode() // The root node of the Trie
    }

    // Method to insert a word into the Trie with a given frequency
    insert(word, frequency = 1) {
        let node = this.root
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode() // Create a new node if char doesn't exist
            }
            node = node.children[char]
        }
        node.isEndOfWord = true
        node.frequency += frequency // Increment frequency by the given value (default is 1)
    }

    // Method to get all words starting with a given prefix, sorted by frequency and limited to k results
    suggestions(prefix, k) {
        let node = this._searchNode(prefix) // Find the node where the prefix ends
        if (!node) return [] // If the prefix doesn't exist, return an empty array

        let results = []
        this._dfs(node, prefix, results) // Perform DFS from the node

        // Sort by frequency in descending order, then alphabetically for ties
        results.sort((a, b) =>
            // Sorted by frequency. If same, frequency, sorted alphabaticallys
            b[1] !== a[1] ? b[1] - a[1] : a[0].localeCompare(b[0])
        )

        return results.slice(0, k).map(e => e[0]) // Return the top k results
    }

    // Private helper method to search for a node corresponding to the last char of word/prefix
    _searchNode(word) {
        let node = this.root
        for (let char of word) {
            if (!node.children[char]) return null // Return null if the char doesn't exist
            node = node.children[char] // Move to the next node
        }
        return node // Return the last node found
    }

    // Private helper method to perform DFS and collect words along with their frequencies
    _dfs(node, prefix, results) {
        if (node.isEndOfWord) results.push([prefix, node.frequency]) // Add the word and its frequency

        for (let char in node.children) {
            this._dfs(node.children[char], prefix + char, results) // Continue the search
        }
    }
}

// Example usage
let trie = new Trie()
trie.insert('apple', 2) // Insert "apple" with a frequency of 2
trie.insert('app', 1) // Insert "app" with a frequency of 1
trie.insert('application', 1) // Insert "application" with default frequency of 1
trie.insert('applet', 3) // Insert "applet" with a frequency of 3
trie.insert('bat', 1)
trie.insert('battle', 2)

console.log(trie.suggestions('app', 3))
// Output: [{ word: 'applet', frequency: 3 }, { word: 'apple', frequency: 2 }, { word: 'app', frequency: 1 }]

console.log(trie.suggestions('bat', 2))
// Output: [{ word: 'battle', frequency: 2 }, { word: 'bat', frequency: 1 }]
