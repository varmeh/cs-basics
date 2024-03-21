function sumzero(arr) {
    let left = 0
    let right = arr.length - 1

    // Atleast two elements are required to find the sum
    if (arr.length === 0 || arr.length === 1) return undefined

    // If all elements are less than 0 or all elements are greater than 0, then sum can't be zero
    if (arr[left] > 0 || arr[right] < 0) return undefined

    while (left < right) {
        let sum = arr[left] + arr[right]
        if (sum === 0) {
            return [arr[left], arr[right]]
        } else if (sum > 0) {
            right--
        } else {
            left++
        }
    }
    return undefined
}

console.log(sumzero([-4, -3, -2, -1, 0, 1, 2, 3, 10])) // [-3, 3]
console.log(sumzero([-2, 0, 1, 3])) // undefined
console.log(sumzero([1, 2, 3])) // undefined
