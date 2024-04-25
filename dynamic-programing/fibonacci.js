/**
 * Dynamic Programming
 *  - Recurrsion without Repitition
 */
function fib(n) {
    if (n == 0 || n == 1) return n

    return fib(n - 1) + fib(n - 2)
}

/**
 *  Recurrsion with Memoization : Cache Results
 *
 *  - Memoization means caching values calculated once during recurrsion & using in subsequent calls
 *      - It's a Top Down Approach as we traverse tree to reach base case
 *      - Then as we cache result as we traverse back the tree
 */
function fibMemoInParam(n, memo = {}) {
    // if fib(n) already cached, use that value
    if (memo[n]) return memo[n]

    if (n == 0 || n == 1) return n

    memo[n] = fibMemoInParam(n - 1, memo) + fibMemoInParam(n - 2, memo)
    return memo[n]
}

// _memo caches fib pairs - `n:fib(n)`
// Base case could be cached directly in _memo
const _memo = { 0: 0, 1: 1 }
function fibMemoGlobalCache(n) {
    // if fib(n) already cached, use that value
    if (_memo[n] !== undefined) return _memo[n]
    // 👆 if(_memo[n]) does not work as _memo[n] -> 0 which means false
    // As a result, code goes to next line & start counting negative numbers

    _memo[n] = fibMemoGlobalCache(n - 1) + fibMemoGlobalCache(n - 2)
    return _memo[n]
}

console.log(`Fib Memo Parameterized for 100 - ${fibMemoInParam(100)}`)
console.log(`Fib Standard for 40 - ${fib(40)}`)
console.log(`Fib Memo as Global Cache for 100 - ${fibMemoGlobalCache(100)}`)

/**
 * Bottom Up Tabulation
 *  - Instead of starting with n & then, figuring out n-1 & n-2, we start with 0 & 1
 *  - Then calculate fib(2) & use fib(2) to calculate fib(3)
 *  - So, we build solution from Bottoms Up
 *
 */
function fibTabulation(n) {
    const table = new Array(n + 1).fill(-1)
    table[0] = 0
    table[1] = 1

    for (let i = 2; i <= n; i++) {
        table[i] = table[i - 2] + table[i - 1]
    }

    return table[n]
}

console.log(`Fib Tabulation for 100 - ${fibTabulation(100)}`)

/**
 * Optimizing for Space
 */

function fibTabulationOptimized(n) {
    const table = [0, 1, -1]

    const tablePosition = n => n % 3

    for (let i = 2; i <= n; i++) {
        table[tablePosition(i)] = table[tablePosition(i - 2)] + table[tablePosition(i - 1)]
    }

    return table[tablePosition(n)]
}

console.log(`Fib Tabulation Optimized for 100 - ${fibTabulationOptimized(100)}`)
