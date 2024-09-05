class Snowflake {
    constructor(machineId) {
        // Validate machine ID to be within 10-bit range (0 to 1023)
        if (machineId < 0 || machineId > 1023) {
            throw new Error('Machine ID must be between 0 and 1023')
        }

        this.machineId = machineId

        // Constants
        this.epoch = new Date('2024-01-01T00:00:00Z').getTime() // Custom epoch (Jan 1, 2024)
        this.machineIdBits = 10 // 10 bits for machine ID
        this.sequenceBits = 12 // 12 bits for sequence number
        this.maxSequence = Math.pow(2, this.sequenceBits) - 1

        // Initialize sequence number and last timestamp
        this.sequence = 0
        this.lastTimestamp = -1
    }

    // Generate 64-bit Snowflake ID
    generate() {
        const timestamp = Date.now() // Get the current timestamp in milliseconds

        // If we are still in the same millisecond, increment the sequence number
        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1) & this.maxSequence // Keep sequence within 12 bits
            if (this.sequence === 0) {
                // If sequence overflows, wait until the next millisecond
                this._waitForNextMillisecond(timestamp)
            }
        } else {
            // Reset sequence for the new timestamp
            this.sequence = 0
            this.lastTimestamp = timestamp
        }

        // Shift and combine parts into a 64-bit Snowflake ID
        // Ops - epoch << 32 | machinId << 12 | sequence
        const snowflakeId =
            ((timestamp - this.epoch) << (this.machineIdBits + this.sequenceBits)) | (this.machineId << this.sequenceBits) | this.sequence

        // Return the Snowflake ID as a Base62 encoded string
        return this._toBase62(snowflakeId)
    }

    // Wait for the next millisecond if the sequence overflows in the current millisecond
    _waitForNextMillisecond(currentTimestamp) {
        while (this._getTimestamp() === currentTimestamp) {
            // Busy wait until the next millisecond
        }
    }

    // Convert a 64-bit number to a Base62 encoded string
    _toBase62(number) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        let base62 = ''

        while (number > 0) {
            base62 = chars[number % 62] + base62
            number = Math.floor(number / 62)
        }

        return base62 || '0' // If number is 0, return '0'
    }
}

// Example usage
const snowflake = new Snowflake(512) // Example machine ID (within 10 bits)
const snowflakeId = snowflake.generate()
console.log('Generated Snowflake ID (Base62):', snowflakeId)
