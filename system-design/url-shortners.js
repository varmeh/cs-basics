/* 
    Why base64 is better than base62?
    - System Hardware operates on base2 ie. binary or bits
    - So, division by 2 means right sgift by 1 bit
    - Similarly, division by 64 means right shift by 6 bits
    - Unlike base62, base64 is a power of 2
    - For base62 calculation, we need to use division and modulo. Inefficient at hardware level
*/

function base64String(inputNumber) {
    const base64 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
    let result = ''
    let number = inputNumber
    while (number > 0) {
        result = base64[number % 64] + result
        number = Math.floor(number / 64)
    }
    console.log(`base64 for ${inputNumber}: ${result} \n`)
}

base64String(10)
base64String(23)
base64String(48)
base64String(56)
base64String(63)
base64String(100)
base64String(1000000)
base64String(10000000000000000)

console.log('\n----------------------\n')

function urlUsingHashFunction() {
    // Take MD5 or Sha Hash using epoch time in nano sec
    // It would return 128-bits or 160-bits
    // 6 bits required for a base-64 system
    // Take a sub-part of hash & convert into a 6 char short url
}

function randomUrlGenerator(sizeOfUrl) {
    const base64 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
    let result = ''
    for (let i = 0; i < sizeOfUrl; i++) {
        const randomNo = Math.floor(Math.random() * 64)
        result = base64[randomNo] + result
    }
    console.log(`Random URL of size ${sizeOfUrl}: ${result}\n`)
}

randomUrlGenerator(6)
randomUrlGenerator(6)
randomUrlGenerator(6)
randomUrlGenerator(8)
randomUrlGenerator(8)
randomUrlGenerator(8)
