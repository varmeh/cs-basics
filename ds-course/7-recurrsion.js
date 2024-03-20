function factorial(num) {
    let total = 1
    for (let i = num; i > 1; i--) {
        total *= i
    }
    return total
}

console.log(`Factorial of ${3} equals ${factorial(3)}`)
console.log(`Factorial of ${4} equals ${factorial(4)}`)
console.log(`Factorial of ${5} equals ${factorial(5)}`)

let t1 = performance.now()
console.log(`Factorial of ${1000} equals ${factorial(1000)}`)
let t2 = performance.now()
const time1 = (t2 - t1) / 1000
console.log(`Time Elapsed for a factorial of 100 : ${time1} seconds`)

/**
 * Factorial with Recurrsion
 */

function factorialRecurrsion(num) {
    if (num === 1) return 1
    return num * factorialRecurrsion(num - 1)
}

console.log(`factorialRecurrsion of ${3} equals ${factorialRecurrsion(3)}`)
console.log(`factorialRecurrsion of ${4} equals ${factorialRecurrsion(4)}`)
console.log(`factorialRecurrsion of ${5} equals ${factorialRecurrsion(5)}`)

t1 = performance.now()
console.log(`FactorialRecurrsion of ${1000} equals ${factorialRecurrsion(1000)}`)
t2 = performance.now()
const time2 = (t2 - t1) / 1000
console.log(`Time Elapsed for a FactorialRecurrsion of 100 : ${time2} seconds`)

console.log(`Factorial / FactorialRecurrsion = ${time1 / time2}`)
