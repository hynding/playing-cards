import { cel, el, qs } from "../../../../utilities/document.js";
import { getNewShuffledDecks } from "../../deck.js";
import {
    getHandRank
} from "./rules.js";

function drawHand() {
    qs("#result").textContent = ''

    const drawn = Number(qs('#cards-drawn').value)
    const cardsForHand = Number(qs('#cards-for-hand').value)
    const size = cardsForHand > drawn ? drawn : cardsForHand

    qs("#cards-for-hand").value = size

    const deck = getNewShuffledDecks(1)
    const hand = deck.slice(0, drawn)

    qs("#result").textContent = getHandRank(hand, size);

    el("#cards")
        .clear()
        .add(
            ...hand.map((card) =>
                cel(
                "div.card",
                cel(`span.${card.suit.color}`, card.suit.symbol),
                card.face.symbol
                )
            )
    );
}

el("#redraw").ev("click", () => {
  drawHand()
});