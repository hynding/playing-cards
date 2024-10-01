import { shuffle } from '../../utilities/array.js'
import FACES from './faces.js'
import SUITS from './suits.js'

export const getNewDeck = () => {
    return SUITS.reduce((deck, suit) => {
        return deck.concat(FACES.map(face => ({face, suit})))
    }, [])
}

export const getNewDecks = (deckCount = 1) => {
    const cards = []
    for (let i = 0; i < deckCount; i++) {
        cards.push(...getNewDeck())
    }
    return cards
}

export const getNewShuffledDecks = (deckCount = 1) => shuffle(getNewDecks(deckCount))