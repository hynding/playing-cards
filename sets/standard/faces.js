const FACE_NAMES = [
    'Ace',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Jack',
    'Queen',
    'King',
]
const FACE_SYMBOLS = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
]

export const FACES = FACE_NAMES.map((name, value) => ({
    name,
    value,
    symbol: FACE_SYMBOLS[value]
}))

export default FACES