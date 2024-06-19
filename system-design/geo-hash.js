// Geo hash Calculator Example - https://www.movable-type.co.uk/scripts/geohash.html

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'

function encodeBinary(value, range, bitLength) {
    let binary = ''
    for (let i = 0; i < bitLength; i++) {
        const mid = (range[0] + range[1]) / 2
        if (value >= mid) {
            binary += '1'
            range[0] = mid
        } else {
            binary += '0'
            range[1] = mid
        }
    }
    return binary
}

function interleaveBits(latBits, lonBits) {
    let binaryString = ''
    for (let i = 0; i < latBits.length; i++) {
        binaryString += lonBits[i] + latBits[i]
    }
    return binaryString
}

function binaryToBase32(binaryString) {
    let hash = ''
    for (let i = 0; i < binaryString.length; i += 5) {
        const chunk = binaryString.substring(i, i + 5)
        const index = parseInt(chunk, 2)
        hash += BASE32[index]
    }
    return hash
}

function getGeohash(latitude, longitude, precision = 12) {
    // Calculate the total number of bits required for the desired precision
    const totalBits = precision * 5 // each precision value is represented by base32 number which used 5 bits

    // Divide by 2 to get the bit length for latitude and longitude
    const bitLength = totalBits / 2

    const latRange = [-90.0, 90.0]
    const lonRange = [-180.0, 180.0]
    const latBits = encodeBinary(latitude, latRange, bitLength)
    const lonBits = encodeBinary(longitude, lonRange, bitLength)

    const interleavedBits = interleaveBits(latBits, lonBits)
    const base32Hash = binaryToBase32(interleavedBits)

    return base32Hash.substring(0, precision)
}

// Example usage:
const latitude = 37.422
const longitude = -122.084
const geohash = getGeohash(latitude, longitude, 6)
console.log(`Geohash: ${geohash}`) // Example output: Geohash: 9q9hvu
