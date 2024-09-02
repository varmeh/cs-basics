/**
 * Pivot Helper - It will help to find the pivot index for the quicksort
 * Pivot === 1st element of the array
 * Not Recommended as Time Complexity is O(n^2) in case of sorted array.
 * For sorted Array, there will be no left side of the pivot. So, the time complexity will be O(n^2)
 */
function pivotStart(arr, startIndex, endIndex) {
    const swap = (i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]])
    let pivot = arr[startIndex]
    let noSmallerThanPivot = startIndex // Index of the smaller elements
    for (let i = startIndex + 1; i <= endIndex; i++) {
        if (arr[i] < pivot) {
            noSmallerThanPivot++
            swap(startIndex + noSmallerThanPivot, i)
        }
    }

    // Pivot at position - startIndex, last number smaller than it at position - noSmallerThanPivot - So, swap
    swap(startIndex, startIndex + noSmallerThanPivot)
    return noSmallerThanPivot
}

// console.log(pivot([20, 35, 5, 15, 30], 0, 4))
console.log(pivotStart([1, 2, 3, 4, 5], 0, 4))
console.log(pivotStart([5, 4, 3, 2, 1], 0, 4))

/**
 * Recommended. Ensure Usage in interviews
 * Here, we randomly select a pivot & replace it with the 1st element of the array
 * Pivot === 1st element of the array
 */
function pivotRandomized(arr, startIndex, endIndex) {
    const swap = (i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]])

    // Randomly select a pivot & replace it with the 1st element of the array
    const pivotIndex = Math.floor(Math.random() * (endIndex - startIndex + 1) + startIndex)
    swap(startIndex, pivotIndex)

    // Start the pivot from the 1st element of the array
    let pivot = arr[startIndex]
    let noSmallerThanPivot = startIndex // Index of the smaller elements
    for (let i = startIndex + 1; i <= endIndex; i++) {
        if (arr[i] < pivot) {
            noSmallerThanPivot++
            swap(noSmallerThanPivot, i)
        }
    }

    // Swap the pivot from the startIndex to the noSmallerThanPivot
    // Value at SwapIndex < Pivot. So, swap ensures that all values less than pivot are to the left of noSmallerThanPivot
    swap(startIndex, noSmallerThanPivot)
    return noSmallerThanPivot
}

/**
 * Pivot === mid element of the array
 * Not recommended. But, good to know
 */
function pivotMid(arr, startIndex, endIndex) {
    const swap = (i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]])
    const mid = Math.floor((startIndex + endIndex) / 2)
    const pivot = arr[mid]
    let noSmallerThanPivot = startIndex
    for (let i = startIndex; i <= endIndex; i++) {
        if (arr[i] < pivot) {
            swap(noSmallerThanPivot, i)
            noSmallerThanPivot++
        }
    }

    // Swap the pivot from the startIndex to the noSmallerThanPivot
    // Value at SwapIndex < Pivot. So, swap ensures that all values less than pivot are to the left of noSmallerThanPivot
    swap(mid, noSmallerThanPivot)
    return noSmallerThanPivot
}

// console.log(pivotMid([20, 35, 28, 15, 30], 0, 4))

function quicksort(arr, startIndex = 0, endIndex = arr.length - 1) {
    if (startIndex >= endIndex) return // Base case - when the array has 1 element or less
    const pivotIndex = pivotRandomized(arr, startIndex, endIndex)
    // left
    quicksort(arr, startIndex, pivotIndex - 1)

    // right
    quicksort(arr, pivotIndex + 1, endIndex)
}

const arr = [20, 35, 5, 15, 30]
quicksort(arr)
console.log(arr)
