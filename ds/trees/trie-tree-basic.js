class TrieNode {
    constructor() {
        this.children = {} // To store child nodes
        this.isEndOfWord = false // To mark the end of a word
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode() // The root node of the Trie
    }

    // Method to insert a word into the Trie
    insert(word) {
        let node = this.root
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode() // Create a new node if char doesn't exist
            }
            node = node.children[char] // Move to the next node
        }
        node.isEndOfWord = true // Mark the end of the word
    }

    // Method to search for a word in the Trie
    search(word) {
        let node = this._searchNode(word)
        return node !== null && node.isEndOfWord // Return true if it's the end of a valid word
    }

    // New method to get all words starting with a given prefix
    suggestions(prefix) {
        let node = this._searchNode(prefix) // Find the node where the prefix ends
        if (!node) return [] // If the prefix doesn't exist, return an empty array

        let results = []
        this._dfs(node, prefix, results) // Perform DFS from the node
        return results
    }

    // Private helper method to search for a node corresponding to the last char of word/prefix
    _searchNode(word) {
        let node = this.root
        for (let char of word) {
            if (!node.children[char]) {
                return null // Return null if the char doesn't exist
            }
            node = node.children[char] // Move to the next node
        }
        return node // Return the last node found
    }

    // Private helper method to perform DFS and collect words
    _dfs(node, prefix, results) {
        if (node.isEndOfWord) {
            results.push(prefix) // If it's a valid word, add to results
        }
        for (let char in node.children) {
            this._dfs(node.children[char], prefix + char, results) // Continue the search
        }
    }
}

// Example usage
let trie = new Trie()
trie.insert('apple')
trie.insert('app')
trie.insert('application')
trie.insert('applet')
trie.insert('bat')
trie.insert('battle')

console.log(trie.suggestions('app')) // ["app", "apple", "application", "applet"]
console.log(trie.suggestions('bat')) // ["bat", "battle"]
console.log(trie.suggestions('zoo')) // []
