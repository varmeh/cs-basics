function selectionSort(arr) {
    const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]])

    for (let i = 0; i < arr.length; i++) {
        let minValue = arr[i]
        let minIndex = i
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < minValue) {
                minValue = arr[j]
                minIndex = j
            }
        }
        if (minIndex !== i) swap(arr, i, minIndex)
    }
    return arr
}

console.log(selectionSort([37, 45, 29, 8, 49, 84, 20, 12, 0, 1, 9, 3, 11, 10, 13, 20, 24]))
