/**
 *
 */
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const currentVal = arr[i]
        let j = i - 1
        while (j >= 0 && arr[j] > currentVal) {
            arr[j + 1] = arr[j]
            j--
        }
        arr[j + 1] = currentVal
    }
    return arr
}

/**
 * Sort using for loop
 */

function insertionSort1(arr) {
    for (let i = 1; i < arr.length; i++) {
        let j = i - 1
        for (; j >= 0 && arr[j] > arr[i]; j--) {
            arr[j + 1] = arr[j]
        }
        arr[j + 1] = arr[i]
    }
    return arr
}

console.log(insertionSort([37, 45, 29, 8, 49]))
console.log(insertionSort1([37, 45, 29, 8, 49]))
