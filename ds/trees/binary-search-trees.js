class Node {
    constructor(value) {
        this.value = value
        this.left = null
        this.right = null
    }
}

class BST {
    constructor() {
        this.root = null
    }

    insert(value) {
        const node = new Node(value)

        if (!this.root) {
            this.root = node
            return
        }

        let current = this.root

        while (current) {
            if (value < current.value) {
                if (!current.left) {
                    // No left node. Set node as left node
                    current.left = node
                    return
                }
                current = current.left
            } else {
                if (!current.right) {
                    // No right node. Set node as right node
                    current.right = node
                    return
                }
                current = current.right
            }
        }
    }

    search(value) {
        let current = this.root
        while (current) {
            if (value === current.value) return true

            current = value < current.value ? current.left : current.right
        }
        return false
    }

    /* Get maximum value in BST */
    max() {
        if (!this.root) return null

        let current = this.root
        while (current.right != null) {
            current = current.right
        }
        return current.value
    }

    /* Get minimum value in BST */
    min() {
        if (!this.root) return null

        let current = this.root
        while (current.left != null) {
            current = current.left
        }
        return current.value
    }

    /**
     * Finds the successor of a given value in the BST.
     * - The successor is the next greater value in the BST, following an in-order traversal.
     * - The node with the maximum value in the BST has no successor.
     * - If the node has a right subtree, the successor is the node with the minimum value in that right subtree.
     * - If the node has no right subtree, the successor is the lowest ancestor for which the given node is in its left subtree.
     */

    successor(value) {
        if (!this.root) return null // Check for empty tree

        // Search for value in tree
        let current = this.root
        let successor = null

        while (current) {
            if (current.value === value) {
                break // Value found
            } else if (value < current.value) {
                successor = current // Potential successor if we move left
                current = current.left
            } else {
                current = current.right // Move right, no change in successor
            }
        }

        if (!current) return null // value not found in bst

        // If current has a right subtree, the min value in that subtree is successor
        if (current.right) {
            let node = current.right
            while (node.left) {
                node = node.left
            }
            return node.value
        }

        // If current does not have a right subtree, the successor is the lowest ancestor
        // for which the current node is in its left subtree (already found during search)
        // Successor === null && current.right === null only for max()
        return successor ? successor.value : null
    }

    _deleteNode(current, parent, child) {
        if (!parent) {
            // Parent would be null if tree had only 2 nodes & root node is to be replaced with child node
            this.root = child
        } else if (parent.left === current) {
            parent.left = child
        } else {
            parent.right = child
        }
    }

    /* Delete key with value */
    delete(value) {
        let current = this.root
        let parent = null

        while (current) {
            if (current.value === value) break
            parent = current
            current = value < current.value ? current.left : current.right
        }

        // Either tree is empty or value not found
        if (!current) return null

        // Case 1 - current is a leaf node
        if (!current.left && !current.right) {
            this._deleteNode(current, parent, null)
            return current.value
        }

        // Case 2 - current has only 1 child
        let child = null
        // Left Child exists
        if (current.left && !current.right) child = current.left

        // Right Child exists
        if (!current.left && current.right) child = current.right

        if (child) {
            // Child will have a value only if node has only 1 child
            this._deleteNode(current, parent, child)
            return current.value
        }

        // Case 3 - current has 2 children
        // To replace this value, we could select value from either left or right tree
        // If left, it has to be max value & for right tree, it has to be min value
        // Let's go with right tree
        let minNode = current.right

        while (minNode.left) {
            minNode = minNode.left
        }

        // Now, delete minNode & swap it's value with current node
        const newValue = minNode.value
        this.delete(newValue) // minNode will either be a leaf node or node with 1 child
        current.value = newValue

        return value
    }

    bfsTraversal() {
        if (!this.root) return null

        const queue = [this.root]
        const result = []
        while (queue.length) {
            const node = queue.shift()
            result.push(node.value)

            if (node.left) queue.push(node.left)
            if (node.right) queue.push(node.right)
        }

        return result
    }

    _preorderHelper(node, result) {
        result.push(node.value)
        if (node.left) this._preorderHelper(node.left, result)
        if (node.right) this._preorderHelper(node.right, result)
    }

    // Traversal Order - (root, left, right)
    preorderTraversal() {
        if (!this.root) return []

        let result = []
        this._preorderHelper(this.root, result)

        return result
    }

    _postorderHelper(node, result) {
        if (node.left) this._postorderHelper(node.left, result)
        if (node.right) this._postorderHelper(node.right, result)
        result.push(node.value)
    }

    // Traversal Order - (left, right, root)
    postorderTraversal() {
        if (!this.root) return []

        let result = []
        this._postorderHelper(this.root, result)

        return result
    }

    _inorderHelper(node, result) {
        if (node.left) this._inorderHelper(node.left, result)
        result.push(node.value)
        if (node.right) this._inorderHelper(node.right, result)
    }

    // Traversal Order - (left, root, right)
    // Note - It returns a sorted list in ascending order as output
    // Change Traversal Order to (right, root, left) to get a descending order list
    inorderTraversal() {
        if (!this.root) return []

        let result = []
        this._inorderHelper(this.root, result)

        return result
    }

    // Not recommended. Done just for fun
    preorderTraversalLinear() {
        const result = []
        const stack = [this.root]

        while (stack.length) {
            let node = stack.pop()
            result.push(node.value)

            // Order of node push matters
            // As right is processed after left, so make sure that left is on top of stack
            if (node.right) stack.push(node.right)
            if (node.left) stack.push(node.left)
        }
        return result
    }

    /****************** Linear Methods ************************/
    // Not recommended for interview as each implementation is different

    // Not recommended. Done just for fun
    postorderTraversalLinear() {
        const result = []

        let stack1 = [this.root]
        let stack2 = []

        while (stack1.length) {
            let node = stack1.pop()
            stack2.push(node)

            if (node.left) stack1.push(node.left)
            if (node.right) stack1.push(node.right)
        }

        while (stack2.length) {
            let node = stack2.pop()
            result.push(node.value)
        }

        return result
    }

    // Not recommended. Done just for fun
    inorderTraversalLinear() {
        const result = []
        const stack = []
        let current = this.root

        while (current !== null || stack.length > 0) {
            // Reach the left most Node of the current Node
            while (current !== null) {
                stack.push(current)
                current = current.left
            }

            // Current must be null at this point
            current = stack.pop()
            result.push(current.value) // Add the node value to result

            // We have visited the node and its left subtree. Now, it's right subtree's turn
            current = current.right
        }

        return result
    }
}

const tree = new BST()
tree.insert(10)
tree.insert(5)
tree.insert(7)
tree.insert(2)
tree.insert(13)
tree.insert(11)
tree.insert(16)
console.log(tree)

console.log(`Value 10 in tree: ${tree.search(10)}`)
console.log(`Value 2 in tree: ${tree.search(2)}`)
console.log(`Value 6 in tree: ${tree.search(6)}`)
console.log(`Value 16 in tree: ${tree.search(16)}`)
console.log(`Value 18 in tree: ${tree.search(18)}`)

console.log(tree.bfsTraversal())
console.log(tree.preorderTraversal())
console.log(tree.preorderTraversalLinear())

console.log(tree.postorderTraversal())
console.log(tree.postorderTraversalLinear())

console.log(tree.inorderTraversal())
console.log(tree.inorderTraversalLinear())

// Test scenarios
console.assert(tree.successor(10) === 11, 'Successor of 10 should be 11.')
console.assert(tree.successor(5) === 7, 'Successor of 5 should be 7.')
console.assert(tree.successor(7) === 10, 'Successor of 7 should be 10.')
console.assert(tree.successor(13) === 16, 'Successor of 13 should be 16.')
console.assert(tree.successor(16) === null, "Successor of 16 should be null, as it's the max value.")
console.assert(tree.successor(2) === 5, 'Successor of 2 should be 5.')
console.assert(tree.successor(11) === 13, 'Successor of 11 should be 13.')
console.assert(tree.successor(1) === null, 'Successor of 1 should be null, as 1 is not in the tree.')
console.assert(tree.successor(17) === null, 'Successor of 17 should be null, as 17 is not in the tree and is greater than the max value.')

console.log('All test cases passed!')
