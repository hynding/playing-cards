import { cel, el, qs } from "../../../../utilities/document.js"
import { getNewDecks, getNewShuffledDecks } from "../../deck.js"

let PLAYERS = []
let ATTACK_CARDS = []

function drawAttackCards() {
    PLAYERS.forEach((hand, i) => {
        const card = hand.shift()
        ATTACK_CARDS.push(card)
        el(`.player-${i} .hand`).add(
            cel(
                "div.card",
                cel(`span.${card.suit.color}`, card.suit.symbol).get(),
                card.face.symbol
            ).get()
        )
        el(`.player-${i} .cards`).clear().add(`(${hand.length})`)
    })
    const highestCardValue = ATTACK_CARDS.reduce((acc, card) => {
        const value = card.face.value || 13
        return acc > value ? acc : value
    }, 0)
    console.log('ATTACK_CARDS', ATTACK_CARDS)
    console.log('highestCardValue', highestCardValue)
    const message = (ATTACK_CARDS.filter(card => {
        return highestCardValue === (card.face.value || 13)
    }).length > 1) ? 'WAR' : 'WINNER'
    PLAYERS.forEach((hand, id) => {
        const value = ATTACK_CARDS[id].face.value || 13
        if (value === highestCardValue) {
            el(`.player-${id} .hand`).add(` <-- ${message}!`)
            el(`.player-${id} .hand .card`).toggleClass("picked")
        }
    })

}

function startGame() {
    const numPlayers = Number(qs('#num-players').value)
    const numDecks = Number(qs('#num-decks').value)
    const cards = getNewShuffledDecks(numDecks)

    PLAYERS = new Array(numPlayers).fill().map(() => [])

    cards.forEach((card, i) => {
        PLAYERS[i % numPlayers].push(card)
    })

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

function init() {
    
    el("#attack").ev("click", () => {
      drawAttackCards()
    })
    startGame()
}

init()