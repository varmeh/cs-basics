// Define Twitter's epoch
const TWITTER_EPOCH = 1288834974657n // Twitter epoch in BigInt

function generateSnowflakeTimestamp() {
    const timestamp = Date.now() // Current timestamp in milliseconds
    console.log(`Original Timestamp: ${timestamp}`)

    // Convert to BigInt and right shift by 23 bits
    const shiftedTimestamp = (BigInt(timestamp) - TWITTER_EPOCH) >> BigInt(23)
    return shiftedTimestamp
}

function snowflakeTimestampToUTC(timestamp) {
    // Calculate the timestamp in milliseconds since the Snowflake epoch
    const snowflakeTimestamp = timestamp << 23n

    // Calculate the approximate original time by adding the Snowflake timestamp to the Twitter epoch
    const approximateOriginalTime = Number(snowflakeTimestamp + TWITTER_EPOCH)
    console.log(`Approximate Original Time (in ms): ${approximateOriginalTime}`)

    return approximateOriginalTime
}

// Generate the shifted timestamp
const snowflakeTimestamp = generateSnowflakeTimestamp()
console.log(`Snowflake Timestamp: ${snowflakeTimestamp}`)

// Convert to UTC Date
const utcDate = new Date(snowflakeTimestampToUTC(snowflakeTimestamp))
console.log(`Approximate Original Time (UTC): ${utcDate.toISOString()}`)
