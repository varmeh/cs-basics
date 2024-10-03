class Player {
    constructor(playerId, score, timestamp) {
        this.playerId = playerId
        this.score = score
        this.createdAt = timestamp
    }
}

class LeaderBoard {
    constructor() {
        this.players = new Map() // stores playerId - player
        this.ranks = [] // to maintain sorted leaderboard, sorted by player score
    }

    updateScore(playerId, newScore) {
        if (!this.players.has(playerId)) {
            // Player does not exist
            console.error(`Player with ID ${playerId} does not exist.`)
            return
        }

        const player = this.players.get(playerId)
        const playerIndex = this._findPlayerIndex(player)
        if (playerIndex === -1) {
            console.error(`Player with ID ${playerId} does not have a RANK`)
        }

        // Remove player current rank from ranks
        this.ranks.splice(playerIndex, 1) // remove 1 element at index playerIndex

        // Update players info
        player.score = newScore

        // find new index for player insertion
        const newIndex = this._findPlayerInsertionIndex(player)

        // Insert the player back into the array
        this.ranks.splice(newIndex, 0, player)
    }

    getPlayerByRank(rank) {
        if (rank < 1 || rank > this.ranks.length) return null // Invalid rank

        const player = this.ranks[rank - 1]

        return {
            playerId: player.playerId,
            score: player.score,
            rank
        }
    }

    // search player based on scores & playerId
    _findPlayerIndex(player) {
        let start = 0
        let end = this.ranks.length - 1

        let mid, midPlayer
        while (start <= end) {
            mid = Math.floor((start + end) / 2)
            midPlayer = this.ranks[mid]
            if (midPlayer.score > player.score) {
                start = mid + 1
            } else if (midPlayer.score < player.score) {
                end = mid - 1
            } else {
                // But score could be shared between multiple players
                // Check if arr[mid] is the target player
                if (midPlayer.playerId === player.playerId) {
                    return mid
                }
                // Now we have reached a point where score matches input score
                // So, check players left & right to mid which share same score

                // Search Left
                let left = mid - 1
                while (left >= start) {
                    if (this.ranks[left].playerId === player.playerId) return left
                    left--
                }

                // Search Right
                let right = mid + 1
                while (right <= end) {
                    if (this.ranks[right].playerId === player.playerId) return right
                    right++
                }

                return -1 // player not found
            }
        }
        return -1 // player not found
    }

    _findPlayerInsertionIndex(player) {
        let start = 0
        let end = this.ranks.length - 1

        let mid, midPlayer
        while (start < end) {
            mid = Math.floor((start + end) / 2)
            midPlayer = this.ranks[mid]

            if (midPlayer.score > player.score) {
                start = mid + 1
            } else if (midPlayer.score < player.score) {
                end = mid - 1
            } else {
                // Equal score
                // move it to Right most point of same score index
                let right = mid + 1
                while (this.ranks[right].score === player.score) right++

                return right
            }
        }

        return start
    }
}
