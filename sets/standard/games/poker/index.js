import { cel, el, qs } from "../../../../utilities/document.js"
import { getNewDecks, getNewShuffledDecks } from "../../deck.js"
import {
    getHandRank
} from "./rules.js"

const testHand = []

function drawCards(selector, handCards, pickedCards) {
    el(selector)
        .clear()
        .add(
            ...handCards.map((card) => {
                const cardEl = ['div', 'card']
                if (pickedCards.includes(card)) {
                    cardEl.push('picked')
                }
                return cel(
                    cardEl.join('.'),
                    cel(`span.${card.suit.color}`, card.suit.symbol).get(),
                    card.face.symbol
                    ).get()
            })
    )
}

function drawHand() {
    qs("#result").textContent = ''

    const drawn = Number(qs('#cards-drawn').value)
    const cardsForHand = Number(qs('#cards-for-hand').value)
    const size = cardsForHand > drawn ? drawn : cardsForHand

    qs("#cards-for-hand").value = size

    const deck = getNewShuffledDecks(1)
    const hand = deck.slice(0, drawn)

    const [rank, cards] = getHandRank(hand, size)
    qs("#result").textContent = rank

    drawCards("#cards", hand, cards)
}

function drawTestHand() {
    if (!testHand.length) {
        el("#test-hand").clear().add("Click cards to add to hand")
        el('#test-rank-hand').clear()
        return
    }

    const [rank, cards] = getHandRank(testHand, testHand.length < 5 ? testHand.length : 5)

    drawCards("#test-hand", testHand, cards)
    el('#test-rank-hand').clear().add(rank)
}

function drawTestDeck() {
    const deck = getNewDecks()

    el('#test-deck').clear().add(
        ...deck.map((card) =>
            cel(
                "div.card",
                cel(`span.${card.suit.color}`, card.suit.symbol).get(),
                card.face.symbol
            )
            .ev('click', (_el) => {
                _el.toggleClass('selected')
                if (testHand.includes(card)) {
                    testHand.splice(testHand.indexOf(card), 1)
                } else {
                    testHand.push(card)
                }
                drawTestHand()
            })
            .get()
        )
    )
}

function drawTestSection() {
    drawTestDeck()
    drawTestHand()
}

function init() {
    drawTestSection()
    
    el("#redraw").ev("click", () => {
      drawHand()
    })
    
    el('#test-reset').ev('click', () => {
        while(testHand.length) {
            testHand.pop()
        }
        drawTestSection()
    })
}

init()