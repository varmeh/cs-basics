/**
 * Recommended
 */
function bubbleSort(arr) {
    const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]])

    for (let i = arr.length; i > 0; i--) {
        let noSwaps = true // used for optimization
        for (let j = 0; j < i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1)
                noSwaps = false
            }
        }
        if (noSwaps) break // if no swaps were made, the array is already sorted
    }
    return arr
}

/**
 * Not Recommended - Basic
 */
function bubbleSort1(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let noSwaps = true // used for optimization
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap
                const temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                noSwaps = false
            }
        }
        if (noSwaps) break
    }
    return arr
}

console.log(bubbleSort([37, 45, 29, 8]))
console.log(bubbleSort1([37, 45, 29, 8]))
