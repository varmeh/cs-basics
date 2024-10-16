class Patient {
    constructor(name, priority) {
        this.name = name
        this.priority = priority
    }
}

class IndexedPriorityQueue {
    constructor() {
        this.pq = [null] // Heap array; index 0 is unused for 1-based indexing
        this.qp = new Map() // Map from patientName to index in pq[]
    }

    // Check if the queue is empty
    isEmpty() {
        return this.pq.length <= 1
    }

    // Get the size of the queue
    _size() {
        return this.pq.length - 1
    }

    // Check if a patient is in the queue
    _contains(patientName) {
        return this.qp.has(patientName)
    }

    // Insert a new patient
    insert(patientName, priority) {
        if (this._contains(patientName)) {
            throw new Error('Patient is already in the queue')
        }
        let patient = new Patient(patientName, priority)
        this.pq.push(patient) // Add patient to the end of the heap
        let index = this._size() // Get the index of the newly added patient
        this.qp.set(patientName, index) // Map patientName to index
        this._bubbleUp(index) // Restore heap property
    }

    // Get the patient with the highest priority
    maxPatient() {
        if (this.isEmpty()) {
            throw new Error('Priority queue underflow')
        }
        return this.pq[1].name // Root element
    }

    // Remove and return the patient with the highest priority
    extractMax() {
        if (this.isEmpty()) {
            throw new Error('Priority queue underflow')
        }
        let maxPatient = this.pq[1]
        this._swap(1, this._size()) // Move last element to root
        this.pq.pop() // Remove last element
        this.qp.delete(maxPatient.name) // Remove mapping
        if (!this.isEmpty()) {
            this._bubbleDown(1) // Restore heap property
        }
        return maxPatient.name
    }

    // Change the priority of a patient
    changePriority(patientName, newPriority) {
        if (!this._contains(patientName)) {
            throw new Error('Patient is not in the queue')
        }
        let index = this.qp.get(patientName)
        let patient = this.pq[index]
        let oldPriority = patient.priority
        patient.priority = newPriority // Update priority

        // Decide whether to bubble up or down
        if (newPriority > oldPriority) {
            this._bubbleUp(index)
        } else if (newPriority < oldPriority) {
            this._bubbleDown(index)
        }
        // If newPriority equals oldPriority, no action is needed
    }

    // Delete a patient from the queue
    delete(patientName) {
        if (!this._contains(patientName)) {
            throw new Error('Patient is not in the queue')
        }
        let indexToDelete = this.qp.get(patientName)
        let lastIndex = this._size()

        // Remove the mapping for the patient
        this.qp.delete(patientName)

        if (indexToDelete === lastIndex) {
            // If deleting the last element, simply remove it
            this.pq.pop()
            return
        }

        // Move the last element to the position of the deleted element
        this._swap(indexToDelete, lastIndex)
        this.pq.pop() // Remove the last element

        // Compare priorities to decide whether to bubble up or down
        let movedPatient = this.pq[indexToDelete]
        let parentIndex = Math.floor(indexToDelete / 2)

        if (parentIndex >= 1 && movedPatient.priority > this.pq[parentIndex].priority) {
            this._bubbleUp(indexToDelete)
        } else {
            this._bubbleDown(indexToDelete)
        }
    }

    // Move a node up the heap to restore heap property
    _bubbleUp(index) {
        while (index > 1) {
            let parentIndex = Math.floor(index / 2)
            if (this.pq[index].priority > this.pq[parentIndex].priority) {
                this._swap(index, parentIndex)
                index = parentIndex
            } else {
                break
            }
        }
    }

    // Move a node down the heap to restore heap property
    _bubbleDown(index) {
        let _size = this._size()
        while (2 * index <= _size) {
            let leftChild = 2 * index
            let rightChild = leftChild + 1
            let largerChild = leftChild

            if (rightChild <= _size && this.pq[rightChild].priority > this.pq[leftChild].priority) {
                largerChild = rightChild
            }

            if (this.pq[index].priority < this.pq[largerChild].priority) {
                this._swap(index, largerChild)
                index = largerChild
            } else {
                break
            }
        }
    }

    // Swap two nodes in the heap and update the mappings
    _swap(i, j) {
        // Swap the patients in the heap array
        let temp = this.pq[i]
        this.pq[i] = this.pq[j]
        this.pq[j] = temp

        // Update the indices in the mapping
        this.qp.set(this.pq[i].name, i)
        this.qp.set(this.pq[j].name, j)
    }
}

// Create a new IndexedPriorityQueue
let ipq = new IndexedPriorityQueue()

// Insert patients
ipq.insert('Alice', 5)
ipq.insert('Bob', 8)
ipq.insert('Charlie', 3)
ipq.insert('Dana', 10)

// Check the patient with the highest priority
console.log(ipq.maxPatient()) // Output: Dana

// Bob's condition worsens; increase his priority
ipq.changePriority('Bob', 12)

// Now Bob has the highest priority
console.log(ipq.maxPatient()) // Output: Bob

// Charlie leaves the hospital; delete him from the queue
ipq.delete('Charlie')

// Extract patients by priority
while (!ipq.isEmpty()) {
    console.log(ipq.extractMax())
}
// Output:
// Bob
// Dana
// Alice
