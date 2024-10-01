export const WINNING_HANDS = [
  "High Card",
  "One Pair",
  "Two Pairs",
  "Three of a Kind",
  "Straight",
  "Flush",
  "Full House",
  "Four of a Kind",
  "Straight Flush",
  "Royal Flush",
];

const getCardsSortedBySuit = (cards) => {
  const cardsBySuit = [[], [], [], []];
  cards.forEach((card) => {
    cardsBySuit[card.suit.value].push(card);
  });
  return cardsBySuit;
};

// sorts from highest to lowest
const getCardsSortedByFace = (cards) => {
  return [...cards].sort((a, b) => {
    return b.face.value - a.face.value;
  });
};

const isAce = (card) => {
  return !card.face.value;
};

export const getHighCard = (cards, size = 1) => {
    return getCardsSortedByFace(cards)[0];
}

export const getMatchingFaceCards = (cards) => {
    const cardsSortedByFace = getCardsSortedByFace(cards);
    const matchingFaceCards = []
    let currentMatches = [];

    cardsSortedByFace.forEach((currentCard, index) => {
        // setup future match
        if (!currentMatches.length) {
            currentMatches.push(currentCard);
            return;
        }
        // no match found
        if (currentMatches[0].face.value !== currentCard.face.value) {
            // add last match is applicable
            if (currentMatches.length > 1) {
                matchingFaceCards.push(currentMatches)
            }
            // reset for future mach
            currentMatches = [currentCard];
            return;
        }

        // match found
        currentMatches.push(currentCard);

        // if last iteration and match found, add to stack 
        if (cardsSortedByFace.length - 1 === index && currentMatches.length > 1) {
            matchingFaceCards.push(currentMatches)
        }
    });

    return matchingFaceCards.sort((a, b) => b.length - a.length);
};

export const getOnePairCards = (cards, size = 2) => {
    const cardsSortedByFace = getCardsSortedByFace(cards);
    
    let onePairCards = null;
    cardsSortedByFace.forEach((currentCard, index) => {
        if (index + size > cardsSortedByFace.length) {
            return;
        }
        const nextCards = cardsSortedByFace.slice(index, index + size);
        const isOnePair = nextCards.every(
            (nextCard) => nextCard.face.value === currentCard.face.value
        );
        if (isOnePair) {
        onePairCards = nextCards;
        }
    });
    return onePairCards;
}

// TODO: fix
export const getTwoPairsCards = (cards, size = 4) => {
    const cardsSortedByFace = getCardsSortedByFace(cards);
    
    let twoPairsCards = null;
    let pairs = 0;
    cardsSortedByFace.forEach((currentCard, index) => {
        if (index + 1 >= cardsSortedByFace.length) {
        return;
        }
        const nextCard = cardsSortedByFace[index + 1];
        if (currentCard.face.value === nextCard.face.value) {
        pairs++;
        if (pairs === 2) {
            twoPairsCards = cardsSortedByFace.slice(index - 1, index + 3);
        }
        }
    });
    return twoPairsCards;
}

export const getThreeOfAKindCards = (cards, size = 3) => {
  const cardsSortedByFace = getCardsSortedByFace(cards);

  let threeOfAKindCards = null;
  cardsSortedByFace.forEach((currentCard, index) => {
    if (index + size > cardsSortedByFace.length) {
      return;
    }
    const nextCards = cardsSortedByFace.slice(index, index + size);
    const isThreeOfAKind = nextCards.every(
      (nextCard) => nextCard.face.value === currentCard.face.value
    );
    if (isThreeOfAKind) {
      threeOfAKindCards = nextCards;
    }
  });
  return threeOfAKindCards;
};

export const getStraightCards = (cards, length = 5, isAlreadySorted = false) => {
    if (!cards.length) {
        return null
    }
    const cardsSortedByFace = isAlreadySorted ? cards : getCardsSortedByFace(cards);
    const uniqueFaceCards = cardsSortedByFace.filter(
        (card, index, sortedCards) => {
            if (index) {
                return card.face.value !== sortedCards[index - 1].face.value;
            }
            return true;
        }
    );

    // check if last cards is an Ace/0, if so, add it to the beginning
    const lowestSortedCard = uniqueFaceCards[uniqueFaceCards.length - 1];
    if (isAce(lowestSortedCard)) {
        uniqueFaceCards.unshift(lowestSortedCard);
    }

    let straightCards = [];
    uniqueFaceCards.forEach((currentCard) => {
        // stop count when highest set caught
        if (straightCards.length === length) {
            return;
        }
        if (!straightCards.length) {
            straightCards.push(currentCard);
            return;
        }
        const previousCard = straightCards[straightCards.length - 1];
        const previousCardFaceValue = isAce(previousCard) ? 13 : previousCard.face.value;

        if (currentCard.face.value + 1 === previousCardFaceValue) {
            straightCards.push(currentCard);
        } else {
            // reset if no straight found
            straightCards = [currentCard];
        }
    });

    if (straightCards.length === length) {
        return straightCards;
    }

    return null;
};

export const getFlushCards = (cards, size = 5) => {
    const cardsSortedBySuit = getCardsSortedBySuit(cards);
    
    let flushCards = null;
    cardsSortedBySuit.forEach((suitCards) => {
        if (suitCards.length >= size) {
            flushCards = suitCards.slice(0, size);
        }
    });
    return flushCards;
};

export const getFullHouseCards = (cards, size = 5) => {
  const cardsSortedByFace = getCardsSortedByFace(cards);

  let fullHouseCards = null;
  let threeOfAKindCards = getThreeOfAKindCards(cardsSortedByFace);
  if (threeOfAKindCards) {
    const remainingCards = cardsSortedByFace.filter(
      (card) => !threeOfAKindCards.includes(card)
    );
    let twoOfAKindCards = getOnePairCards(remainingCards, 2);
    if (twoOfAKindCards) {
      fullHouseCards = [...threeOfAKindCards, ...twoOfAKindCards];
    }
  }
  return fullHouseCards;
};

export const getFourOfAKindCards = (cards, size = 4) => {
    const cardsSortedByFace = getCardsSortedByFace(cards);
    
    let fourOfAKindCards = null;
    cardsSortedByFace.forEach((currentCard, index) => {
        if (index + size > cardsSortedByFace.length) {
        return;
        }
        const nextCards = cardsSortedByFace.slice(index, index + size);
        const isFourOfAKind = nextCards.every(
        (nextCard) => nextCard.face.value === currentCard.face.value
        );
        if (isFourOfAKind) {
        fourOfAKindCards = nextCards;
        }
    });
    return fourOfAKindCards;
}

// TODO: sort highest card set matched (rare cases)
export const getStraightFlushCards = (cards, size = 5, isAlreadySorted = false) => {
  const cardsSortedBySuit = isAlreadySorted ? cards : getCardsSortedBySuit(cards);

  let straightFlushCards = null;
  cardsSortedBySuit.forEach((suitCards) => {
    const straightCards = getStraightCards(suitCards, size);
    if (straightCards?.length === size) {
      straightFlushCards = straightCards;
    }
  });
  return straightFlushCards;
};

export const getHandRank = (cards, handSize = 5) => {
    const matchingFaceCards = getMatchingFaceCards(cards);
    const cardsSortedBySuitsAndFace = getCardsSortedBySuit(cards).map((suitCards) => getCardsSortedByFace(suitCards));
    const straightFlushCards = getStraightFlushCards(cardsSortedBySuitsAndFace, handSize, true) || [];
    const royalFlushCards = (straightFlushCards.length && isAce(straightFlushCards[0])) ? straightFlushCards : []
    const flushCards = getFlushCards(cards, handSize) || []
    const straightCards = getStraightCards(cards, handSize) || []
    const fourOfAKindCards = matchingFaceCards.filter((cards) => cards.length === 4) ?? []
    const threeOfAKindCards = matchingFaceCards.filter((cards) => cards.length === 3)?.[0] ?? []
    const twoOfAKindCards = matchingFaceCards.filter((cards) => cards.length === 2) ?? []
    // TODO: FIX: consider a hand with two sets of three of a kind
    const fullHouseCards = threeOfAKindCards.length && twoOfAKindCards.length ? [...threeOfAKindCards, ...twoOfAKindCards[0]] : []
    const twoPairsCards = twoOfAKindCards.length > 1 ? [...twoOfAKindCards[0], ...twoOfAKindCards[1]] : []
    const onePairCards = twoOfAKindCards.length ? twoOfAKindCards[0] : []

    if (royalFlushCards.length) {
        return ['Royal Flush', royalFlushCards];
    } else if (straightFlushCards.length) {
        return ['Straight Flush', straightFlushCards];
    } else if (fourOfAKindCards.length) {
        return ['Four of a Kind', fourOfAKindCards];
    } else if (fullHouseCards.length) {
        return ['Full House', fullHouseCards];
    } else if (flushCards.length) {
        return ['Flush', flushCards];
    } else if (straightCards.length) {
        return ['Straight', straightCards];
    } else if (threeOfAKindCards.length) {
        return ['Three of a Kind', threeOfAKindCards];
    } else if (twoPairsCards.length) {
        return ['Two Pairs', twoPairsCards];
    } else if (onePairCards.length) {
        return ['One Pair', onePairCards];
    } else {
        return ['High Card', [getHighCard(cards)]]
    }
}
