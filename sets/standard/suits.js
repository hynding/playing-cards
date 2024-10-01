const SUIT_NAMES = [
    'Spades',
    'Diamonds',
    'Clubs',
    'Hearts'
]
const SUIT_SYMBOLS = [
    '♠',
    '♦',
    '♣',
    '♥'
]
const SUIT_COLORS = [
    'black',
    'red',
    'black',
    'red'
]

export const SUITS = SUIT_NAMES.map((name, value) => ({
    name,
    value,
    symbol: SUIT_SYMBOLS[value],
    color: SUIT_COLORS[value]
}))

export default SUITS