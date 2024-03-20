class QuickFind {
    constructor(size) {
        this.array = []
        for (let i = 0; i < size; i++) {
            this.array[i] = i
        }
        this._print()
    }

    union(a, b) {}

    connected(a, b) {}

    _print() {
        console.log(`--> ${this.array}`)
    }
}

/*-------------------------- Demo Code --------------------------*/
const a = new QuickFind(10)
a.union(1, 2)
a.union(3, 4)
a.union(5, 6)
a.connected(9, 10)
a.union(7, 8)
a.union(7, 9)
a.union(1, 8)
a.union(1, 10)
a.connected(2, 4)
a.connected(2, 10)
a.connected(2, 5)
