function addToN1(n) {
    let total = 0
    for (let i = 1; i <= n; i++) {
        total += i
    }
    console.log(`N1 - Sum of all whole numbers upto ${n} equals ${total}`)
}

function addToN2(n) {
    console.log(`N2 - Sum of all whole numbers upto ${n} equals ${(n * (n + 1)) / 2}`)
}

addToN1(3)
addToN2(3)
