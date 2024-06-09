class SnowflakeIdGenerator {
    static TWITTER_EPOCH = 1288834974657n // Twitter's epoch for Snowflake IDs

    constructor(machineId) {
        if (machineId < 0 || machineId > 1023) {
            throw new Error('Machine ID must be between 0 and 1023')
        }
        this.machineId = BigInt(machineId)
        this.lastTimestamp = -1n
        this.sequence = 0n
    }

    // The sequence number starts from 0 and increments with 1, resetting to 0 after 1 millisecond.
    _getSequenceNumber(currentTimestamp) {
        if (currentTimestamp - this.lastTimestamp < 1n) {
            this.sequence = (this.sequence + 1n) & 0xfffn // Ensuring it's a 12-bit number (4095 max)
        } else {
            this.sequence = 0n
        }
        this.lastTimestamp = currentTimestamp
        return this.sequence
    }

    _generateID(timestamp, machineId, sequenceNo) {
        // Removing least significant 23-bits to make a 41-bit timestamp
        const _41BitTimestamp = (BigInt(timestamp) - SnowflakeIdGenerator.TWITTER_EPOCH) >> BigInt(23)

        // Timestamp takes 1-42 most significant bits in ID. So, reposition
        const shiftedTimestamp = _41BitTimestamp << 22n // 41-bits moved to position
        console.log(`Shifted Time stamp: ${shiftedTimestamp}`)

        const shiftedMachineId = machineId << 12n
        console.log(`Shifted machineId: ${shiftedMachineId}`)

        const uniqueID = shiftedTimestamp | shiftedMachineId | BigInt(sequenceNo)
        return uniqueID
    }

    generate() {
        const timestamp = BigInt(Date.now()) // Current timestamp in milliseconds
        console.log(`Original Timestamp: ${timestamp}`)

        const sequenceNo = this._getSequenceNumber(timestamp)
        return this._generateID(timestamp, this.machineId, sequenceNo).toString()
    }

    static timestamp(id) {
        // Extract the 41-bit timestamp from the Snowflake ID
        const timestamp = BigInt(id) >> 22n // shift by 12 bits of sequence no + 10 bits of machine id

        // Convert to milliseconds since the Snowflake epoch
        const snowflakeTimestamp = timestamp << 23n // converting 41-bits to most significant bits of 64-bit timestamp

        // Calculate the approximate original time by adding the Snowflake timestamp to the Twitter epoch
        const approximateOriginalTime = Number(snowflakeTimestamp + SnowflakeIdGenerator.TWITTER_EPOCH)
        console.log(`Approximate Original Time (in ms): ${approximateOriginalTime}`)

        return new Date(approximateOriginalTime).toISOString() // Convert to UTC time
    }
}

// Example usage:
const snowflakeGen = new SnowflakeIdGenerator(1) // Create an instance with machine ID 1
const id = snowflakeGen.generate()
console.log(`Snowflake Id - ${id}`)

console.log(`Time from Snowflake Id ${id} : ${SnowflakeIdGenerator.timestamp(id)}`)
