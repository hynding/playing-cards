import { shuffle } from "../../utilities/array.js";
import { el, cel } from "../../utilities/document.js";
import { getNewDeck } from "./deck.js";

const render = (cards) => {
  el("#cards")
    .clear()
    .add(
      ...cards.map((card) =>
        cel(
          "div.card",
          cel(`span.${card.suit.color}`, card.suit.symbol),
          card.face.symbol
        )
      )
    );
};

render(getNewDeck());

el("#shuffle").ev("click", () => {
  render(shuffle(getNewDeck()));
});

el("#reset").ev("click", () => {
  render(getNewDeck());
});
