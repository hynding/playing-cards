const getCardsSortedBySuit = (cards) => {
  const cardsBySuit = [[], [], [], []]
  cards.forEach((card) => {
    cardsBySuit[card.suit.value].push(card)
  })
  return cardsBySuit
}

const isAce = (card) => {
  return !card.face.value
}

const getFaceValue = (card) => isAce(card) ? 13 : card.face.value

// sorts from highest to lowest with exception of Ace/0
const getCardsSortedByFace = (cards) => {
  return [...cards].sort((cardA, cardB) => {
    return getFaceValue(cardB) - getFaceValue(cardA)
  })
}

export const getHighCard = (cards, size = 1) => {
    return getCardsSortedByFace(cards)[0]
}

export const getMatchingFaceCards = (cards) => {
    const cardsSortedByFace = getCardsSortedByFace(cards)
    const matchingFaceCards = []
    let currentMatches = []

    cardsSortedByFace.forEach((currentCard, index) => {
        // setup future match
        if (!currentMatches.length) {
            currentMatches.push(currentCard)
            return
        }
        // no match found
        if (currentMatches[0].face.value !== currentCard.face.value) {
            // add last match is applicable
            if (currentMatches.length > 1) {
                matchingFaceCards.push(currentMatches)
            }
            // reset for future mach
            currentMatches = [currentCard]
            return
        }

        // match found
        currentMatches.push(currentCard)

        // if last iteration and match found, add to stack 
        if (cardsSortedByFace.length - 1 === index && currentMatches.length > 1) {
            matchingFaceCards.push(currentMatches)
        }
    })

    return matchingFaceCards.sort((a, b) => b.length - a.length)
}

export const getStraightCards = (cards, length = 5, isAlreadySorted = false) => {
    if (!cards.length) {
        return null
    }
    const cardsSortedByFace = isAlreadySorted ? cards : getCardsSortedByFace(cards)
    const uniqueFaceCards = cardsSortedByFace.filter(
        (card, index, sortedCards) => {
            if (index) {
                return card.face.value !== sortedCards[index - 1].face.value
            }
            return true
        }
    )

    // check if first cards is an Ace/0, if so, add it to the end
    if (isAce(uniqueFaceCards[0])) {
        uniqueFaceCards.push(uniqueFaceCards[0])
    }

    let straightCards = []
    uniqueFaceCards.forEach((currentCard) => {
        // stop count when highest set caught
        if (straightCards.length === length) {
            return
        }
        if (!straightCards.length) {
            straightCards.push(currentCard)
            return
        }
        const previousCard = straightCards[straightCards.length - 1]
        const previousCardFaceValue = getFaceValue(previousCard)

        if (currentCard.face.value + 1 === previousCardFaceValue) {
            straightCards.push(currentCard)
        } else {
            // reset if no straight found
            straightCards = [currentCard]
        }
    })

    if (straightCards.length === length) {
        return straightCards
    }

    return null
}

export const getFlushCards = (cards, size = 5) => {
    const cardsSortedBySuit = getCardsSortedBySuit(cards)
    
    let flushCards = null
    cardsSortedBySuit.forEach((suitCards) => {
        if (suitCards.length >= size) {
            flushCards = getCardsSortedByFace(suitCards).slice(0, size)
        }
    })
    return flushCards
}

// TODO: sort highest card set matched (rare cases)
export const getStraightFlushCards = (cards, size = 5, isAlreadySorted = false) => {
  const cardsSortedBySuit = isAlreadySorted ? cards : getCardsSortedBySuit(cards)

  let straightFlushCards = null
  cardsSortedBySuit.forEach((suitCards) => {
    const straightCards = getStraightCards(suitCards, size)
    if (straightCards?.length === size) {
      straightFlushCards = straightCards
    }
  })
  return straightFlushCards
}

const getFullHouseCards = (threeOfAKindCards, twoOfAKindCards) => {
    // account for cases where more than 5 cards are in play and multipe 3 of a kind are present
    if (threeOfAKindCards.length > 1) {
        if (twoOfAKindCards.length) {
            const topTwoOfAKindValue = getFaceValue(twoOfAKindCards[0][0])
            const topThreeOfAKindValue = getFaceValue(threeOfAKindCards[1][0])
            if (topTwoOfAKindValue > topThreeOfAKindValue) {
                return [...threeOfAKindCards[0], ...twoOfAKindCards[0]]
            } else {
                return [...threeOfAKindCards[0], threeOfAKindCards[1][0], threeOfAKindCards[1][1]]
            }
        } else {
            return [...threeOfAKindCards[0], ...threeOfAKindCards[1].slice(0, 2)]
        }
    } else if (threeOfAKindCards.length && twoOfAKindCards.length) {
        return [...threeOfAKindCards[0], ...twoOfAKindCards[0]]
    }
    return []
}

export const getTieBreakingCards = (winningCards, hand, handSize = 5) => {
    const tieBreakingCards = hand.filter((card) => !winningCards.includes(card))
    return getCardsSortedByFace(tieBreakingCards).slice(0, handSize - winningCards.length)
}

export const getHandRank = (cards, handSize = 5) => {
    const matchingFaceCards = getMatchingFaceCards(cards)
    const cardsSortedBySuitsAndFace = getCardsSortedBySuit(cards).map((suitCards) => getCardsSortedByFace(suitCards))
    const straightFlushCards = getStraightFlushCards(cardsSortedBySuitsAndFace, handSize, true) || []
    const royalFlushCards = (straightFlushCards.length && isAce(straightFlushCards[0])) ? straightFlushCards : []
    const flushCards = getFlushCards(cards, handSize) || []
    const straightCards = getStraightCards(cards, handSize) || []
    const fourOfAKindCards = matchingFaceCards.filter((cards) => cards.length === 4) ?? []
    const threeOfAKindCards = matchingFaceCards.filter((cards) => cards.length === 3) ?? []
    const twoOfAKindCards = matchingFaceCards.filter((cards) => cards.length === 2) ?? []
    const fullHouseCards = getFullHouseCards(threeOfAKindCards, twoOfAKindCards)
    const twoPairsCards = twoOfAKindCards.length > 1 ? [...twoOfAKindCards[0], ...twoOfAKindCards[1]] : []
    const onePairCards = twoOfAKindCards.length ? twoOfAKindCards[0] : []

    if (royalFlushCards.length > 1) {
        return ['Royal Flush', royalFlushCards, []]
    } else if (straightFlushCards.length > 1) {
        return ['Straight Flush', straightFlushCards, []]
    } else if (fourOfAKindCards.length) {
        return ['Four of a Kind', fourOfAKindCards[0], getTieBreakingCards(fourOfAKindCards[0], cards, handSize)]
    } else if (fullHouseCards.length) {
        return ['Full House', fullHouseCards, []]
    } else if (flushCards.length > 1) {
        return ['Flush', flushCards, []]
    } else if (straightCards.length > 1) {
        return ['Straight', straightCards, []]
    } else if (threeOfAKindCards.length) {
        return ['Three of a Kind', threeOfAKindCards[0], getTieBreakingCards(threeOfAKindCards[0], cards, handSize)]
    } else if (twoPairsCards.length) {
        return ['Two Pairs', twoPairsCards, getTieBreakingCards(twoPairsCards, cards, handSize)]
    } else if (onePairCards.length) {
        return ['One Pair', onePairCards, getTieBreakingCards(onePairCards, cards, handSize)]
    } else {
        const highCard = getHighCard(cards)
        return ['High Card', [highCard], getTieBreakingCards([highCard], cards, handSize)]
    }
}
