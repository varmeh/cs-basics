function merge(arr1, arr2) {
    let index1 = 0
    let index2 = 0
    const mergedArr = []
    while (index1 < arr1.length && index2 < arr2.length) {
        if (arr1[index1] < arr2[index2]) {
            mergedArr.push(arr1[index1])
            index1++
        } else {
            mergedArr.push(arr2[index2])
            index2++
        }
    }

    // Push remaining elements of Arr1, if any
    while (index1 < arr1.length) {
        mergedArr.push(arr1[index1])
        index1++
    }

    // Push remaining elements of Arr2, if any
    while (index2 < arr2.length) {
        mergedArr.push(arr2[index2])
        index2++
    }

    return mergedArr
}

console.log(merge([1, 10, 50], [2, 14, 99, 100])) // [1, 2, 10, 14, 50, 99, 100]

function mergeSort(arr) {
    if (arr.length <= 1) return arr
    const mid = Math.floor(arr.length / 2)
    const left = mergeSort(arr.slice(0, mid))
    const right = mergeSort(arr.slice(mid))
    return merge(left, right)
}

console.log(mergeSort([10, 24, 76, 73, 72, 1, 9])) // [1, 9, 10, 24, 72, 73, 76]
