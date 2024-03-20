/**
 * Linear Search
 * @param {L} arr
 * @param {*} val
 * @returns
 */

function linearSearch(arr, val) {
    for (let i in arr) {
        if (arr[i] === val) {
            return i
        }
    }
    return -1
}

const arr = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]

console.log(`linearSearch(arr, 25): ${linearSearch(arr, 25)}`)
console.log(`linearSearch(arr, -5): ${linearSearch(arr, -5)}`)

/**
 * Binary Search
 */

function binarySearch(arr, val) {
    let left = 0
    let right = arr.length - 1

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        //console.log(`left: ${left}, right: ${right}, mid: ${mid}`)
        if (arr[mid] === val) {
            return mid
        } else if (arr[mid] < val) {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}

console.log(`binarySearch(arr, 25): ${binarySearch(arr, 25)}`)
console.log(`binarySearch(arr, -5): ${binarySearch(arr, -5)}`)

/**
 * Binary Search Recursive
 */

function binarySearchRecursive(arr, val, left = 0, right = arr.length - 1) {
    if (left > right) return -1

    const mid = Math.floor((left + right) / 2)
    console.log(`left: ${left}, right: ${right}, mid: ${mid}`)
    if (arr[mid] === val) {
        return mid
    } else if (arr[mid] < val) {
        return binarySearchRecursive(arr, val, mid + 1, right)
    } else {
        return binarySearchRecursive(arr, val, left, mid - 1)
    }
}

console.log(`binarySearchRecursive(arr, 25): ${binarySearchRecursive(arr, 25)}`)
console.log(`binarySearchRecursive(arr, -5): ${binarySearchRecursive(arr, -5)}`)

/**
 * SubString Count
 */

function subStringCounter(str, subStr) {
    let count = 0
    for (let i = 0; i < str.length; i++) {
        if (str[i] === subStr[0]) {
            for (let j = 0; j < subStr.length; j++) {
                if (str[i + j] !== subStr[j]) break
                if (j === subStr.length - 1) count++
            }
        }
    }
    return count
}

console.log(`subStringCounter('helolo world', 'lo'): ${subStringCounter('helolo world', 'lo')}`)
