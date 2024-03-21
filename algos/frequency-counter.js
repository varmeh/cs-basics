// Following function returns True, if arr2 elements are square of arr1 elements
function sameSquared(arr1, arr2) {
    // 1st check - same number of elements
    if (arr1.length !== arr2.length) return false

    const freqObj1 = {}
    for (let val of arr1) {
        const sqVal = val ** 2
        freqObj1[sqVal] = ++freqObj1[sqVal] || 1
    }
    console.log(`freqObj1: ${JSON.stringify(freqObj1)}`)

    const freqObj2 = {}
    for (let val of arr2) {
        freqObj2[val] = ++freqObj2[val] || 1
    }
    console.log(`freqObj2: ${JSON.stringify(freqObj2)}`)

    for (let key in freqObj2) {
        if (freqObj1[key] !== freqObj2[key]) {
            return false
        }
    }
    return true
}

console.log(sameSquared([1, 2, 2], [4, 1, 4]))
console.log(sameSquared([1, 2, 3], [4, 1, 4]))

/* -------------------------------- Anagram ------------------------------------------ */

function anagram(str1, str2) {
    if (str1.length !== str2.length) return false

    const freqObj1 = {}
    for (let char of str1) {
        freqObj1[char] = ++freqObj1[char] || 1
    }
    console.log(`freqObj1: ${JSON.stringify(freqObj1)}`)

    const freqObj2 = {}
    for (let char of str2) {
        freqObj2[char] = ++freqObj2[char] || 1
    }
    console.log(`freqObj2: ${JSON.stringify(freqObj2)}`)

    for (let key in freqObj1) {
        if (freqObj1[key] !== freqObj2[key]) {
            return false
        }
    }
    return true
}

console.log(anagram('', ''))
console.log(anagram('car', 'rac'))
console.log(anagram('car', 'rat'))
console.log(anagram('anagram', 'nagaram'))

/* -------------------------------- Unique Values ------------------------------------------ */
function countUniqueValues(arr) {
    if (arr.length === 0) return 0

    const uniqueKeys = {}
    let counter = 0
    for (let val of arr) {
        if (!uniqueKeys[val]) {
            uniqueKeys[val] = 1
            counter++
        }
    }

    // return Object.keys(uniqueKeys).length
    return counter
}

console.log(countUniqueValues([1, 1, 1, 1, 1, 2])) // 2
console.log(countUniqueValues([1, 2, 3, 4, 4, 4, 7, 7, 12, 12, 13])) // 7
console.log(countUniqueValues([])) // 0
console.log(countUniqueValues([-2, -1, -1, 0, 1])) // 4
