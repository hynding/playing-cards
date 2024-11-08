import { cel, el, qs } from "../../../../utilities/document.js"
import { getNewShuffledDecks } from "../../deck.js"

let PLAYERS = []
let ATTACK_CARDS = []
let WAR_PLAYERS = []
let handsPlayed = 0
let numWarCards = 4
// TODO
let numHandsBeforeShuffle = 0
// TODO
let enableShuffleAfterSetHands = false
// TODO - if more than two players started the game and any player has no cards left,
//        the next war pile will be split between the winner and the player(s) with no cards left
let enableSpoilsOfWar = false

function refreshPlayers() {
    el('#game').clear().add(
        ...PLAYERS.map((hand, i) => {
            return cel(`div.player-${i}`)
                .add(
                    cel('span', `Player ${i + 1} `).get(),
                    cel('span.cards', `(${hand.length})`).get(),
                    cel('span.hand').get()
                ).get()
        })
    )
}

function drawWarCards() {
    const warCards = []
    WAR_PLAYERS.forEach((playerIndex, i) => {
        const hand = PLAYERS[playerIndex]
        const cards = hand.splice(0, numWarCards)
        ATTACK_CARDS.push(...cards)
        warCards.push(cards)
        el(`.player-${playerIndex} .hand`).add(
            ...cards.map(card => cel(
                "div.card",
                cel(`span.${card.suit.color}`, card.suit.symbol).get(),
                card.face.symbol
            ).get())
        )
        el(`.player-${playerIndex} .cards`).clear().add(`(${hand.length})`)
    })
    // check if any player has less than the highest number of cards
    const highestWarPileCount = warCards.reduce((acc, cards) => {
        return acc > cards.length ? acc : cards.length
    }, 0)
    // if no players have cards left, split the war pile
    if (highestWarPileCount === 0) {
        ATTACK_CARDS.forEach((card, i) => {
            PLAYERS[WAR_PLAYERS[i % WAR_PLAYERS.length]].push(card)
        })
        WAR_PLAYERS = []
        ATTACK_CARDS = []
        return
    }
    const remainingPlayers = []
    const remainingWarCards = []
    // if any player has less than the highest number of cards, they lose
    WAR_PLAYERS.forEach((playerIndex, i) => {
        if (warCards[i].length < highestWarPileCount) {
            el(`.player-${playerIndex} .hand`).add(` <-- LOSE!`)
            // el(`.player-${playerIndex} .hand .card`).toggleClass("picked")
        } else {
            remainingPlayers.push(playerIndex)
            remainingWarCards.push(warCards[i])
        }
    })
    // determine if the war is over, otherwise draw more cards for war!
    if (remainingPlayers.length === 1) {
        const winner = remainingPlayers[0]
        el(`.player-${winner} .hand`).add(` <-- WINNER! (remaining players out of cards)`)
        el(`.player-${winner} .hand .card`).toggleClass("picked")
        // count goes wrong here
        console.log('winner (playerIndex)', winner)
        console.log('ATTACK_CARDS', ATTACK_CARDS)
        PLAYERS[winner].push(...ATTACK_CARDS)
        WAR_PLAYERS = []
        ATTACK_CARDS = []
        return
    }
    const remainingPlayersCards = remainingPlayers.map((playerIndex, i) => {
        const hand = remainingWarCards[i]
        return hand.pop()
    })
    const highestCardValue = remainingPlayersCards.reduce((acc, card) => {
        const value = card.face.value || 13
        return acc > value ? acc : value
    }, 0);
    const nextWarPlayers = remainingPlayersCards.reduce((acc, card, playerIndex) => {
        const value = card.face.value || 13
        if (value === highestCardValue) {
            acc.push(remainingPlayers[playerIndex])
        }
        return acc
    }, [])
    const message = (nextWarPlayers.length > 1) ? 'WAR' : 'WINNER'
    remainingPlayers.forEach((playerIndex, i) => {
        const card = remainingPlayersCards[i]
        const value = card.face.value || 13
        if (value === highestCardValue) {
            el(`.player-${playerIndex} .hand`).add(` <-- ${message}!`)
            el(`.player-${playerIndex} .hand .card`).toggleClass("picked")
        }
    })
    if (nextWarPlayers.length > 1) {
        console.log('nextWarPlayers', nextWarPlayers)
        WAR_PLAYERS = nextWarPlayers
        return
    }
    // count also goes wrong here
    console.log('post war winner', nextWarPlayers[0])
    console.log('ATTACK_CARDS', ATTACK_CARDS)
    const winner = nextWarPlayers[0]
    PLAYERS[winner].push(...ATTACK_CARDS)
    WAR_PLAYERS = []
    ATTACK_CARDS = []
}

function drawAttackCards() {
    if (WAR_PLAYERS.length) {
        drawWarCards()
        return
    }
    handsPlayed++
    refreshPlayers()
    PLAYERS.forEach((hand, i) => {
        const card = hand.shift()
        ATTACK_CARDS.push(card)
        if (card) {
            el(`.player-${i} .hand`).add(
                cel(
                    "div.card",
                    cel(`span.${card.suit.color}`, card.suit.symbol).get(),
                    card.face.symbol
                ).get()
            )
            el(`.player-${i} .cards`).clear().add(`(${hand.length})`)
        }
    })
    const highestCardValue = ATTACK_CARDS.reduce((acc, card) => {
        if (!card) return acc
        const value = card.face.value || 13
        return acc > value ? acc : value
    }, 0)
    const message = (ATTACK_CARDS.filter((card, index) => {
        if (!card) return false
        const hasHighestCardValue = highestCardValue === (card.face.value || 13)
        if (hasHighestCardValue) {
            WAR_PLAYERS.push(index)
        }
        return hasHighestCardValue
    }).length > 1) ? 'WAR' : 'WINNER'
    PLAYERS.forEach((hand, id) => {
        const card = ATTACK_CARDS[id]
        if (!card) return
        const value = card.face.value || 13
        if (value === highestCardValue) {
            el(`.player-${id} .hand`).add(` <-- ${message}!`)
            el(`.player-${id} .hand .card`).toggleClass("picked")
        }
    })

    ATTACK_CARDS = ATTACK_CARDS.filter(card => card)

    if (WAR_PLAYERS.length === 1) {
        PLAYERS[WAR_PLAYERS[0]].push(...ATTACK_CARDS)
        WAR_PLAYERS = []
        ATTACK_CARDS = []
    }

}

function startGame() {
    const numPlayers = Number(qs('#num-players').value)
    const numDecks = Number(qs('#num-decks').value)
    numWarCards = Number(qs('#num-war-cards').value)
    handsPlayed = 0
    const cards = getNewShuffledDecks(numDecks)

    WAR_PLAYERS = []
    ATTACK_CARDS = []
    PLAYERS = new Array(numPlayers).fill().map(() => [])

    cards.forEach((card, i) => {
        PLAYERS[i % numPlayers].push(card)
    })

    refreshPlayers()
}

function init() {
    
    el("#attack").ev("click", () => {
      drawAttackCards()
    })
    el("#start-game").ev("click", () => {
        startGame()
    })
    startGame()
}

init()