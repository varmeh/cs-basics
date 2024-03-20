/**
 * Pivot Helper - It will help to find the pivot index for the quicksort
 * Pivot === 1st element of the array
 * Not Recommended as Time Complexity is O(n^2) in case of sorted array.
 * For sorted Array, there will be no left side of the pivot. So, the time complexity will be O(n^2)
 */
function pivotStart(arr, start, end) {
    const swap = (i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]])
    let pivot = arr[start]
    let swapIndex = start // Index of the smaller elements
    for (let i = start + 1; i <= end; i++) {
        if (arr[i] < pivot) {
            swapIndex++
            swap(swapIndex, i)
        }
    }

    // Swap the pivot from the start to the swapIndex
    // Value at SwapIndex < Pivot. So, swap ensures that all values less than pivot are to the left of swapIndex
    swap(start, swapIndex)
    return swapIndex
}

// console.log(pivot([20, 35, 5, 15, 30], 0, 4))
console.log(pivotStart([1, 2, 3, 4, 5], 0, 4))
console.log(pivotStart([5, 4, 3, 2, 1], 0, 4))

/**
 * Recommended. Ensure Usage in interviews
 * Here, we randomly select a pivot & replace it with the 1st element of the array
 * Pivot === 1st element of the array
 */
function pivotRandomized(arr, start, end) {
    const swap = (i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]])

    // Randomly select a pivot & replace it with the 1st element of the array
    const pivotIndex = Math.floor(Math.random() * (end - start + 1) + start)
    swap(start, pivotIndex)

    // Start the pivot from the 1st element of the array
    let pivot = arr[start]
    let swapIndex = start // Index of the smaller elements
    for (let i = start + 1; i <= end; i++) {
        if (arr[i] < pivot) {
            swapIndex++
            swap(swapIndex, i)
        }
    }

    // Swap the pivot from the start to the swapIndex
    // Value at SwapIndex < Pivot. So, swap ensures that all values less than pivot are to the left of swapIndex
    swap(start, swapIndex)
    return swapIndex
}

/**
 * Pivot === mid element of the array
 * Not recommended. But, good to know
 */
function pivotMid(arr, start, end) {
    const swap = (i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]])
    const mid = Math.floor((start + end) / 2)
    const pivot = arr[mid]
    let swapIndex = start
    for (let i = start; i <= end; i++) {
        if (arr[i] < pivot) {
            swap(swapIndex, i)
            swapIndex++
        }
    }

    // Swap the pivot from the start to the swapIndex
    // Value at SwapIndex < Pivot. So, swap ensures that all values less than pivot are to the left of swapIndex
    swap(mid, swapIndex)
    return swapIndex
}

// console.log(pivotMid([20, 35, 28, 15, 30], 0, 4))

function quicksort(arr, start = 0, end = arr.length - 1) {
    if (start >= end) return // Base case - when the array has 1 element or less
    const pivotIndex = pivotRandomized(arr, start, end)
    // left
    quicksort(arr, start, pivotIndex - 1)

    // right
    quicksort(arr, pivotIndex + 1, end)
}

const arr = [20, 35, 5, 15, 30]
quicksort(arr)
console.log(arr)
