class Node {
    constructor(player, score, parent = null) {
        this.player = player // Player's name or ID
        this.score = score // Player's score
        this.left = null // Left child (higher scores)
        this.right = null // Right child (lower or equal scores)
        this.parent = parent // Parent node
        this.size = 1 // Size of the subtree rooted at this node, including itself
    }
}

/**
 * Leaderboard implementation using Augmented BST
 * This BST nodes are augmented with size to find kth element in O(log n) time
 */
class LeaderBoard {
    constructor() {
        this.root = null
        this.playerMap = {} // HashMap to store player name to node mapping
    }

    insert(player, score) {
        const newNode = new Node(player, score)

        // Add to playerMap
        this.playerMap[player] = newNode

        if (this.root === null) {
            // If the tree is empty, set the new node as the root
            this.root = newNode
            return
        }

        let cur = this.root

        while (true) {
            cur.size += 1 // Increment size since we're adding a new node in its subtree

            if (score > cur.score) {
                // Higher score in left sub-tree
                if (cur.left === null) {
                    cur.left = newNode
                    newNode.parent = cur
                    return
                } else {
                    cur = cur.left
                }
            } else {
                // Lower or equal scores go to the right subtree
                // For equal scores, this ensures that the first player stays higher in the tree
                if (cur.right === null) {
                    cur.right = newNode
                    newNode.parent = cur
                    return
                } else {
                    cur = cur.right
                }
            }
        }
    }

    delete(player) {
        // Get the node from the playerMap
        const nodeToDelete = this.playerMap[player]

        if (!nodeToDelete) {
            console.log(`Player ${player} not found.`)
            return false
        }

        // Remove the node from the tree
        this._deleteNode(nodeToDelete)

        // Remove from playerMap
        delete this.playerMap[player]

        return true
    }

    _deleteNode(node) {
        if (!node.left && !node.right) {
            // Case 1: No children
            this._replaceNodeInParent(node, null)
        } else if (node.left && !node.right) {
            // Case 2: Only left child
            this._replaceNodeInParent(node, node.left)
        } else if (!node.left && node.right) {
            // Case 2: Only right child
            this._replaceNodeInParent(node, node.right)
        } else {
            // Case 3: Two children
            // Find the in-order successor (smallest node in the right subtree)
            let successor = node.right
            while (successor.left) {
                successor = successor.left
            }

            // Copy the successor's data to the node
            node.player = successor.player
            node.score = successor.score
            this.playerMap[node.player] = node // Update playerMap

            // Delete the successor node
            this._deleteNode(successor)
            return // Sizes updated during successor deletion
        }

        // Update the size attributes up the tree
        this._updateSizeUpwards(node.parent)
    }

    _replaceNodeInParent(node, newNode) {
        if (node.parent) {
            if (node === node.parent.left) {
                node.parent.left = newNode
            } else {
                node.parent.right = newNode
            }
            if (newNode) {
                newNode.parent = node.parent
            }
        } else {
            // Node is root
            this.root = newNode
            if (this.root) {
                this.root.parent = null
            }
        }
    }

    _updateSizeUpwards(node) {
        while (node) {
            node.size = 1 + (node.left ? node.left.size : 0) + (node.right ? node.right.size : 0)
            node = node.parent
        }
    }

    // Helper method to find the minimum node starting from a given node
    _findMin(node) {
        while (node.left !== null) {
            node = node.left
        }
        return node
    }

    // Update score function
    updateScore(player, newScore) {
        // First, delete the player
        const deleted = this.delete(player)

        if (!deleted) {
            console.log(`Player ${player} not found. Cannot update score.`)
            return false
        }

        // Re-insert the player with the new score
        this.insert(player, newScore)

        return true
    }

    // Method to get the player by rank
    getPlayerByRank(k) {
        if (!this.root || k < 1 || k > this.root.size) {
            console.log(`Rank ${k} is out of bounds.`)
            return null
        }

        return this._select(this.root, k)
    }

    // Helper method to recursively find the kth player
    _select(node, k) {
        if (node === null) {
            return null
        }

        const leftSize = node.left ? node.left.size : 0

        if (k <= leftSize) {
            // The kth player is in the left subtree
            return this._select(node.left, k)
        } else if (k === leftSize + 1) {
            // The current node is the kth player
            return { player: node.player, score: node.score }
        } else {
            // The kth player is in the right subtree
            // Adjust k to account for the left subtree and current node
            return this._select(node.right, k - leftSize - 1)
        }
    }

    // Method to display the leaderboard in order
    getLeaderboard() {
        const results = []
        this._inOrderTraversal(this.root, results)
        return results
    }

    // Helper method for in-order traversal
    _inOrderTraversal(node, results) {
        if (node !== null) {
            this._inOrderTraversal(node.left, results)
            results.push({ player: node.player, score: node.score })
            this._inOrderTraversal(node.right, results)
        }
    }

    // Function to print the tree in a tree-like format
    printTree() {
        this._printSubtree(this.root, '', true)
    }

    // Helper function to recursively print the tree
    _printSubtree(node, prefix, isLeft) {
        if (node !== null) {
            console.log(prefix + (isLeft ? '├── ' : '└── ') + node.player + ' (' + node.score + ', size=' + node.size + ')')
            const childPrefix = prefix + (isLeft ? '│   ' : '    ')
            // Print left and right subtrees
            if (node.left || node.right) {
                this._printSubtree(node.left, childPrefix, true)
                this._printSubtree(node.right, childPrefix, false)
            }
        }
    }
}

// Create an instance of the Leaderboard
const leaderboard = new LeaderBoard()

// Insert players to form a tree where certain nodes will have two children
leaderboard.insert('a', 50)
leaderboard.insert('b', 30)
leaderboard.insert('c', 70)
leaderboard.insert('d', 20)
leaderboard.insert('e', 40)
leaderboard.insert('f', 60)
leaderboard.insert('g', 80)
leaderboard.insert('h', 35)
leaderboard.insert('i', 45)
leaderboard.insert('j', 55)
leaderboard.insert('k', 65)

// Display the initial leaderboard
console.log('Initial Leaderboard:')
console.log(leaderboard.getLeaderboard())
leaderboard.printTree()

// Delete nodes with two children
// 'b' has two children: 'd' and 'e'
// 'c' has two children: 'f' and 'g'
// 'a' (root) has two children: 'b' and 'c'

// Delete 'b' and check the tree structure
leaderboard.delete('b')
console.log('\nLeaderboard after deleting b (node with two children):')
console.log(leaderboard.getLeaderboard())
leaderboard.printTree()

// Delete 'c' and check the tree structure
leaderboard.delete('c')
console.log('\nLeaderboard after deleting c (node with two children):')
console.log(leaderboard.getLeaderboard())

// Delete 'a' (root node with two children) and check the tree structure
leaderboard.delete('a')
console.log('\nLeaderboard after deleting a (root node with two children):')
console.log(leaderboard.getLeaderboard())

// Get players by rank
console.log('\nGet players by rank:')
for (let k = 1; k <= leaderboard.root.size; k++) {
    const playerData = leaderboard.getPlayerByRank(k)
    console.log(`Rank ${k}: ${playerData.player} (${playerData.score})`)
}
