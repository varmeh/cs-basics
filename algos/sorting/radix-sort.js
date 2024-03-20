function getDigit(num, i) {
    return Math.floor(Math.abs(num) / Math.pow(10, i)) % 10
}

function digitCount(num) {
    if (num === 0) return 1
    return Math.floor(Math.log10(Math.abs(num))) + 1
}

function mostDigits(arr) {
    // 1st find the biggest number in the array
    let max = 0
    for (let num of arr) {
        max = Math.abs(num) > max ? Math.abs(num) : max
    }

    // Return the number of digits in the biggest number
    return digitCount(max)
}

// console.log(getDigit(7323, 2)) // 3
// console.log(mostDigits([1234, 56, 7, 98765])) // 5

function radixSort(arr) {
    const maxDigitCount = mostDigits(arr)

    for (let k = 0; k < maxDigitCount; k++) {
        const digitBuckets = Array.from({ length: 10 }, () => [])

        for (let i = 0; i < arr.length; i++) {
            const digit = getDigit(arr[i], k)
            digitBuckets[digit].push(arr[i])
        }
        // console.log(...digitBuckets)
        arr = [].concat(...digitBuckets)
    }
    return arr
}

console.log(radixSort([23, 345, 5467, 12, 2345, 9852]))
