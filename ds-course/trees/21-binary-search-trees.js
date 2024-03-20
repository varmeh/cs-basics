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
        // Empty value
        if (!this.root) return false

        let current = this.root
        while (current) {
            if (value === current.value) return true

            current = value < current.value ? current.left : current.right
        }
        return false
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
