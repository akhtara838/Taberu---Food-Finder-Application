
var lastCards = [];

export function getLastCards()
{
    return lastCards;
}

export function addToLastCards(card)
{
    lastCards.push(card);
}