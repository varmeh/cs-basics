function permutation(str, prefix) {
    // console.log(`str: ${str}, prefix: ${prefix}`)

    if (str.length === 0) {
        console.log(prefix)
        return 1
    }
    let count = 0 // Initialize count variable
    for (let i = 0; i < str.length; i++) {
        const remStr = str.substring(0, i) + str.substring(i + 1)
        const newPrefix = prefix + str.charAt(i)
        // console.log(`i: ${i}, str: ${remStr}, prefix: ${newPrefix}`)
        count += permutation(remStr, newPrefix) // Accumulate count for each permutation
    }
    return count
}

console.log(`\nab has ${permutation('ab', '')} permutations`) // ab, ba

console.log('-----------------\n')

console.log(`\nabc has ${permutation('abc', '')} permutations`) // abc, acb, bac, bca, cab, cba

console.log('-----------------\n')

console.log(`\nabcd has ${permutation('abcd', '')} permutations`) // abcd, abdc, acbd, acdb, adbc, adcb, bacd, badc, bcad, bcda, bdac, bdca, cabd, cadb, cbad, cbda, cdab, cdba, dabc, dacb, dbac, dbca, dcab, dcba
